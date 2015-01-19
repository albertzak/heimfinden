Listings = new Meteor.Collection('listings');

if(Meteor.isClient) {
  Listings.defaultSelector = function() {
    return {
      plz:     {$in: Util.objectToArray(Session.get('filter-plz'))},
      price:   {$lt: Session.get('filter-priceUpper'), $gt: Session.get('filter-priceLower')},
      pricem2: {$lt: Session.get('filter-pricem2')},
      m2:      {$lt: Session.get('filter-m2Upper'), $gt: Session.get('filter-m2Lower')}    
    };
  }
}

Meteor.methods({
  vote: function(id, down) {
    var user = Meteor.user();
    var listing = Listings.findOne(id);

    if (!user) Meteor.loginWithFacebook();
    if (!listing) throw('URL not found');

    if (down) {
      if(_.include(listing.upvoters, user._id)) {
        Listings.update(listing._id, {
          $pull: {upvoters: user._id},
          $inc: {votes: -1}
        });
      }
      if (_.include(listing.downvoters, user._id)) throw('Already downvoted');
      Listings.update(listing._id, {
        $addToSet: {downvoters: user._id},
        $inc: {votes: -1}
      });

    } else {
      if(_.include(listing.downvoters, user._id)) {
        Listings.update(listing._id, {
          $pull: {downvoters: user._id},
          $inc: {votes: +1}
        });
      }
      if (_.include(listing.upvoters, user._id)) throw('Already upvoted');
      Listings.update(listing._id, {
        $addToSet: {upvoters: user._id},
        $inc: {votes: +1}
      });
    }
  },
});
