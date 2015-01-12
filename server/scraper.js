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
  paused: true,

  pause: function() {
    console.log("INFO", "Scraper paused");
    Scraper.paused = true;
  },

  unpause: function() {
    console.log("INFO", "Scraper running");
    Scraper.paused = false;
  },

  seed: function() {
    console.log("INFO", "Seeding scraper tasks");
    ScraperTasks.register(Scrapers.resultsTasks);
  },

  run: function() {
    if( ! Scraper.paused) {
      var task = ScraperTasks.getRandomTask();

      if(task)
        Scraper.runTask(task);
      else
        Scraper.seed();
    }

    Meteor.setTimeout(Scraper.run, 2500);
  },

  runTask: function(task) {
    task = task.payload;

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

    parsedDetail = scraper.parseDetail($$);
    parsedDetail = _.extend(_.extend(parsedDetail, task.detail), {
      plz:     task.plz,
      url:     task.url,
      type:    task.type,
      source:  task.source,
      price:   Math.ceil(parsedDetail.price),
      pricem2: Math.round(parsedDetail.price / parsedDetail.m2),
      scrapedTimestamp:   Math.floor(Date.now() / 1000),
    });

    console.log("INFO", parsedDetail);

    var existingListing = Listings.findOne({url: task.url});

    if (existingListing) {
      console.log("INFO", "Updating existing listing");
      Listings.update({url: task.url}, _.extend(existingListing, parsedDetail));
    } else {
      console.log("INFO", "Inserting new listing");
      Listings.insert(parsedDetail);
    }

    return true;
  }
};

Meteor.startup(function() {
  Scraper.seed();
  Scraper.run();
})
