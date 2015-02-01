Meteor.publish('nextListings', function(limit) {
  var selector = {
    upvoters:   {$ne: this.userId},
    downvoters: {$ne: this.userId},
  };

  return Listings.find(selector, {
    sort:  { sourceTimestamp: 1 },
  });
});

Meteor.publish('votedListings', function(voteDirection) {
  if (voteDirection === 'upvoted')
    var selector = { upvoters: this.userId};
  else if (voteDirection === 'downvoted')
    var selector = { downvoters: this.userId};
  else
    var selector = {
      $or: [
        { downvoters: this.userId},
        { upvoters:   this.userId}
      ]
    };

  return Listings.find(selector, {
    sort: {sourceTimestamp: -1},
    limit: 5
  });
});

Meteor.publish('singleListing', function(_id) {
  return Listings.find(_id);
});

Meteor.publish('friendsListings', function() {
  var friends = Meteor.users.findOne(this.userId).friends || [];
  
  var selector = {
    upvoters:   {$in: friends},
    downvoters: {$ne: this.userId}
  };

  return Listings.find(selector);
});
