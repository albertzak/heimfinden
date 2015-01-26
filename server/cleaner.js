Cleaner = {
  run: function() {
    Cleaner.cleanOldNoUpvotes();
    Cleaner.cleanLimits();
  
    Meteor.setTimeout(Cleaner.run, 1000 * 60 * 60);
  },

  cleanOldNoUpvotes: function() {
    var selector = {
      sourceTimestamp: {$lt: Sanitize.limits.minSourceTimestamp()},
      upvoters: []
    };

    var count = Listings.find(selector).count();
    
    if(count > 0) {
      Listings.remove(selector);
      console.log("INFO", "Removed old listings with no upvotes:", count);
    }
  },

  cleanLimits: function() {
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
      console.log("INFO", "Removed listings outside of limits with no upvoters:", count);
    }
  }

}

Meteor.startup(function() {
  Meteor.setTimeout(Cleaner.run, 1000 * 60 * 60);
});
