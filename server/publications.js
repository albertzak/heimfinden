Meteor.publish('nextListings', function() {
  return Listings.find({
    upvoters:   {$ne: this.userId},
    downvoters: {$ne: this.userId},
  }, {
    sort: {sourceTimestamp: 1},
    limit: 5
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
