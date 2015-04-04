Listings = new Meteor.Collection('listings');

if(Meteor.isClient) {
  Listings.defaultSelector = function() {
    return {
      plz:     {$in: Util.objectToArray(Session.get('filter-plz'))},
      price:   {$lte: Session.get('filter-priceUpper'), $gte: Session.get('filter-priceLower')},
      pricem2: {$lte: Session.get('filter-pricem2')},
      m2:      {$lte: Session.get('filter-m2Upper'), $gte: Session.get('filter-m2Lower')}    
    };
  }
}

Meteor.methods({
  vote: function(id, down) {
    var user = Meteor.user();
    var listing = Listings.findOne(id);

    if (!user) Meteor.loginWithFacebook({requestPermissions: Accounts.ui._options.requestPermissions.facebook});
    if (!listing) return;

    if (down) {
      if(_.include(listing.upvoters, user._id)) {
        Listings.update(listing._id, {
          $pull: {upvoters: user._id},
          $inc: {votes: -1}
        });
      }
      if (_.include(listing.downvoters, user._id)) return;
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
      if (_.include(listing.upvoters, user._id)) return;
      Listings.update(listing._id, {
        $addToSet: {upvoters: user._id},
        $inc: {votes: +1}
      });
    }
  },
});
