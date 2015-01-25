request = Meteor.npmRequire('request');

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
  paused: false,

  pause: function() {
    console.log("INFO", "Scraper paused");
    Scraper.paused = true;
  },

  unpause: function() {
    console.log("INFO", "Scraper running");
    Scraper.paused = false;
  },

  seed: function() {
    try {
      ScraperTasks.register(Scrapers.resultsTasks);
    } catch(e) {
      console.log("ERROR", "Seeding", e);
    }

    Meteor.setTimeout(Scraper.seed, 1000*60*5);
  },

  run: function() {
    try {
      if( ! Scraper.paused) {
        var task = ScraperTasks.getRandomTask();

        if(task)
          Scraper.runTask(task);
        else
          Scraper.seed();
      }
    } catch(e) {
      console.log("ERROR", "Exception in Scraper", e.stack);
    }

    Meteor.setTimeout(Scraper.run, 2500);
  },

  runTask: function(task) {
    task = task.payload;

    if(ScraperTasksBlacklist.match(task))
      ScraperTasks.remove({'payload.url': task.url});

    if(task.parseType === 'results')
      success = Scraper.scrapeResults(task);
    else if (task.parseType === 'detail')
      success = Scraper.scrapeDetail(task);
    else
      console.log('ERROR', 'Unrecognized task type', task.parseType);

    if (success)
      ScraperTasks.remove({'payload.url': task.url});
    else
      console.log('WARNING', 'Task not successful', task);
  },

  scrapeResults: function(task) {
    var scraper = Scrapers.all[task.source];
    var $ = ScraperUtil.fetch(task.url);

    var results = $(scraper.resultSelector);

    if (results.length == 0)
      console.log('WARNING', 'No results for task', task);

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

        Listings.update({url: task.url}, _.extend(_.extend(existingListing, parsedDetail), {
          votes:      votes,
          upvoters:   upvoters,
          downvoters: downvoters
        }));
      } else {
        Listings.insert(parsedDetail);
      }
    } else {
      console.log('INFO', 'Blacklisting task', task);
      ScraperTasksBlacklist.register(task);
    }

    return true;
  }
};

Meteor.startup(function() {
  Scraper.seed();
  Scraper.run();
})
