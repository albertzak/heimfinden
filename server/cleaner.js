Cleaner = {
  run: function() {
    var selector = {
      sourceTimestamp: {$lt: Sanitize.limits.minSourceTimestamp()},
      upvoters: []
    }

    var count = Listings.find(selector).count();
    
    if(count > 0) {
      Listings.remove(selector);
      console.log("INFO", "Removed old listings with no upvotes:", count);
    }
  
    Meteor.setTimeout(Cleaner.run, 1000 * 60 * 60);
  }
}

Meteor.startup(function() {
  Meteor.setTimeout(Cleaner.run, 1000 * 60 * 60);
});
