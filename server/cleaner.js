Cleaner = {
  autorun: function() {
    Meteor.setInterval(Cleaner.run, 1000 * 60 * 60);
  },

  run: function(log) {
    if (typeof log === 'undefined')
      log = false;

    Cleaner.cleanScraperTasksBlacklist(log);
    Cleaner.cleanOldNoUpvotes(log);
    Cleaner.cleanLimits(log);
  },

  cleanOldNoUpvotes: function(log) {
    var selector = {
      sourceTimestamp: {$lt: Sanitize.limits.minSourceTimestamp()},
      upvoters: []
    };

    var count = Listings.find(selector).count();
    
    if(count > 0) {
      Listings.remove(selector);
      if (log)
        Logger.log('info', 'Cleaner', 'Removed old listings with no upvotes: ' + count);
    }
  },

  cleanLimits: function(log) {
    var selector = {
      $or: [
        {$or: [ {price:   {$lt: Sanitize.limits.minPrice}},   {price: {$gt: Sanitize.limits.maxPrice     }}]},
        {$or: [ {m2:      {$lt: Sanitize.limits.minm2}},      {m2:    {$gt: Sanitize.limits.maxm2        }}]},
        {$or: [ {pricem2: {$lt: Sanitize.limits.minPricem2}}, {pricem2: {$gt: Sanitize.limits.maxPricem2 }}]},
        {$not: { plz: {$in: Sanitize.limits.plz}}}
      ],
      upvoters: []
    };

    var count = Listings.find(selector).count();

    if(count > 0) {
      Listings.remove(selector);
      if (log)
        Logger.log('info', 'Cleaner', 'Removed listings outside of limits with no upvoters: ' + count);
    }
  },

  cleanScraperTasksBlacklist: function(log) {
    var selector = { lastMatchTimestamp: {$lt: Sanitize.limits.minLastMatchTimestamp()}};
    var count = ScraperTasksBlacklist.find(selector).count();

    if(count > 0) {
      ScraperTasksBlacklist.remove(selector);
      if (log)
        Logger.log('info', 'Cleaner', 'Cleaned scraper tasks blacklist: ' + count);
    }
  }

}

Meteor.startup(function() {
  Cleaner.autorun();
});
