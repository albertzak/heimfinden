request = Meteor.npmRequire('request');
Fiber   = Meteor.npmRequire('fibers');

Scrapers = {
  all: {},
  resultsTasks: [],

  register: function(scraper) {
    _.each(Object.keys(scraper), function(scraperName) {
      scraper[scraperName].name = scraperName;
    });

    _.extend(Scrapers.all, scraper);

    Scrapers.updateResultsTasks();
  },

  each: function(iteratee) {
    _.each(Scrapers.all, function(scraper) {
      return iteratee(scraper);
    });
  },

  updateResultsTasks: function() {
    _.each(Scrapers.all, function(scraper) {
      var tempResultsTasks = _.map(scraper.resultsTasks, function(resultTask) {
        return _.extend(resultTask, {
          source: scraper.name,
          parseType: 'results'
        });
      })

      Scrapers.resultsTasks = _.union(Scrapers.resultsTasks, [tempResultsTasks]);
    });
  }
};

Scraper = {
  pause: function() {
    ScraperStatus.set("Paused", { paused: true });
  },

  unpause: function() {
    ScraperStatus.set("Running", { paused: false });
  },

  seed: function() {
    try {
      ScraperTasks.register(Scrapers.resultsTasks);
    } catch(e) {
      Logger.log('danger', 'Exception while Seeding', e);
    }
  },

  autorun: function() {
    try {
      var interval = (Meteor.users.activeCount() > 0) ? 250 : 2500;
      Fiber(function() {
        Scraper.run();
      }).run();
    } catch(e) {
      Logger.log('danger', 'Exception in Scraper Autorun', e.stack);
    }

    Meteor.setTimeout(Scraper.autorun, interval || 250);
  },

  run: function() {
    if(ScraperStatus.isPaused()) { return; }
    var task = ScraperTasks.getRandomTask();
    if( ! task) { Scraper.seed(); }

    try {
      Scraper.runTask(task);
    } catch(e) {
      Logger.log('danger', 'Exception in Scraper ' + task.payload.source, JSON.stringify(task.payload) + '\n\n' + e.stack);
    }
  },

  runTask: function(task) {
    task = task.payload;

    if(ScraperTasksBlacklist.match(task)) {
      ScraperTasks.remove({'payload.url': task.url});
      return;
    }

    if(task.parseType === 'results')
      success = Scraper.scrapeResults(task);
    else if (task.parseType === 'detail') {
      if(Listings.findOne({url: task.url})) {
        ScraperTasks.remove({'payload.url': task.url});
        return;
      }
      success = Scraper.scrapeDetail(task);
    }
    else {
      Logger.log('warning', 'Unrecognized task type', task.parseType);
    }

    if (success)
      ScraperTasks.remove({'payload.url': task.url});
  },

  scrapeResults: function(task) {
    var scraper = Scrapers.all[task.source];
    var $ = ScraperUtil.fetch(task.url);

    var results = $(scraper.resultSelector);

    if (results.length == 0)
      Logger.log('warning', 'No results for task', task);

    results.each(function(i, el) {
      var parsedResult = scraper.parseResult($, el);

      ScraperTasks.register({
          url:       parsedResult.url,
          plz:       parseInt(task.plz),
          type:      task.type,
          source:    scraper.name,
          parseType: 'detail',
          detail:    parsedResult.detail
      });
    });

    return true;
  },

  scrapeDetail: function(task) {
    var scraper = Scrapers.all[task.source];
    $$ = ScraperUtil.fetch(task.url);

    if (scraper.isNoLongerListed($$)) {
      ScraperTasksBlacklist.register(task);
      return true;
    }

    if (scraper.isPending($$)) {
      return false;
    }

    parsedDetail = scraper.parseDetail($$);
    parsedDetail = _.extend(_.extend(parsedDetail, task.detail), {
      plz:     task.plz,
      url:     task.url,
      type:    task.type,
      source:  task.source,
      price:   Math.ceil(parsedDetail.price),
      pricem2: Math.round(parsedDetail.price / parsedDetail.m2),
      scrapedTimestamp:   Math.floor(Date.now() / 1000),
      votes:      0,
      upvoters:   [],
      downvoters: []
    });

    if(Sanitize.validateDetail(parsedDetail)) {
      var existingListing = Listings.findOne({url: task.url});

      if (existingListing) {
        var votes      = existingListing.votes;
        var upvoters   = existingListing.upvoters;
        var downvoters = existingListing.downvoters;

        existingListing = _.unpick(existingListing, ['_id']);

        Listings.update({url: task.url}, _.extend(_.extend(existingListing, parsedDetail), {
          votes:      votes,
          upvoters:   upvoters,
          downvoters: downvoters
        }));
      } else {
        Listings.insert(parsedDetail);
      }
    } else {
      ScraperTasksBlacklist.register(task);
    }

    return true;
  }
};

Meteor.startup(function() {
  Scraper.seed();
  Scraper.autorun();
})
