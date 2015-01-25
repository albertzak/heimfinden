Cleaner = {
  run: function() {
    cleanOldNoUpvotes();
    cleanLimits();
  
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
    var count = 0;

    _.each(Listings.find({}).fetch(), function(listing) {
      if ( ! Sanitize.validateLimits(listing)) {
        // Listings.remove(listing._id);
        count += 1;
      }
    });

    if(count > 0) {
      Listings.remove(selector);
      console.log("INFO", "Removed listings outside of limits:", count);
    }
  }

}

Meteor.startup(function() {
  Meteor.setTimeout(Cleaner.run, 1000 * 60 * 60);
});
