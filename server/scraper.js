request = Meteor.npmRequire('request');

Scrapers = {
  all: {},
  basicTargets: [],

  register: function(scraper) {
    _.each(Object.keys(scraper), function(scraperName) {
      scraper[scraperName].name = scraperName;
    });

    _.extend(Scrapers.all, scraper);

    Scrapers.updateBasicTargets();
  },

  each: function(iteratee) {
    _.each(Scrapers.all, function(scraper) {
      return iteratee(scraper);
    });
  },

  updateBasicTargets: function() {
    _.each(Scrapers.all, function(scraper) {
      var tempBasicTargets = _.map(scraper.basicTargets, function(basicTarget) {
        return _.extend(basicTarget, {
          source: scraper.name,
          parseType: 'basic'        
        });
      })

      Scrapers.basicTargets = _.union(Scrapers.basicTargets, [tempBasicTargets]);
    });
  }
};

Scraper = {

  seed: function() {
    ScraperTasks.register(Scrapers.basicTargets);
  },

  run: function(force) {
    if (typeof force === 'undefined') { force = false; }

    var task = ScraperTasks.getRandomTask();

    if(task) {
      task = task.payload;

      if(task.parseType === 'basic')
        success = Scraper.runBasic(task);
      else if (task.parseType === 'detail')
        success = Scraper.runDetail(task);
      else
        console.log('Unrecognized task type', task.parseType);

      if (success)
        ScraperTasks.remove({'payload.url': task.url});
      else
        console.log('WARNING', 'Task not successful', task);
    } else {
      Scraper.seed();
    }

    Meteor.setTimeout(Scraper.run, 2500);
  },

  runBasic: function(task) {
    var scraper = Scrapers.all[task.source];
    var $ = ScraperUtil.fetch(task.url);

    var results = $(scraper.resultSelector);

    if (results.length == 0)
      console.log('WARNING', 'No results for task', task);
    
    results.each(function(i, el) {
      var listingInfo = scraper.parseResult($, el);
      
      listingInfo = _.extend(listingInfo, {
        title: listingInfo.title.trim(),
        scrapeSource: scraper.name,
        scrapeTimestamp: Math.floor(Date.now() / 1000),
        price: Math.ceil(listingInfo.price),
        pricem2: Math.round(listingInfo.price / listingInfo.m2),
        type: task.type,
      });

      // Duplicate this task to scrape details if needed
      if(typeof listingInfo.detailTimestamp === 'undefined') {
        var detailTask = {
          url:  listingInfo.url,
          plz:  listingInfo.plz,
          type: listingInfo.type,
          source: task.source,
          parseType: 'detail'
        };

        ScraperTasks.register(detailTask);
        listingInfo.pending = true;
      }

      Listings.update({url: listingInfo.url}, listingInfo, {upsert: true});

    });

    return true;
  },

  runDetail: function(task) {
    var scraper = Scrapers.all[task.source];
    $$ = ScraperUtil.fetch(task.url);
    listingInfoDetail = scraper.parseDetail($$);
    listingInfoDetail = _.extend(listingInfoDetail, {
      detailTimestamp:   Math.floor(Date.now() / 1000),
      pending: false
    });

    listingInfo = Listings.findOne({url: task.url});
    listtingInfo = _.extend(listingInfo, listingInfoDetail);
    Listings.update({url: task.url}, listingInfo, {upsert: true});

    return true;
  }
};

Meteor.startup(function() {
  Scraper.seed();
  Scraper.run();
})
