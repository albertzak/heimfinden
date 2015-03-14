Meteor.publish('nextListings', function(limit) {
  var selector = {
    upvoters:   [],
    downvoters: [],
  };

  return Listings.find(selector, {
    sort:  { sourceTimestamp: 1 },
  });
});

Meteor.publish('votedListings', function(voteDirection) {
  if (voteDirection === 'upvoted')
    var selector = { 'upvoters.0': { $exists: true }};
  else if (voteDirection === 'downvoted')
    var selector = { 'downvoters.0': { $exists: true }};
  else
    var selector = {
      $or: [
        { 'downvoters.0': { $exists: true }},
        { 'upvoters.0':   { $exists: true }}
      ]
    };

  return Listings.find(selector, {
    sort: {sourceTimestamp: -1},
  });
});

Meteor.publish('singleListing', function(_id) {
  return Listings.find(_id);
});

Meteor.publish('friendsListings', function() {
  if (this.userId && Meteor.users.findOne(this.userId))
    var friends = Meteor.users.findOne(this.userId).friends || [];
  else
    var friends = [];
      
  var selector = {
    upvoters:   {$in: friends},
    downvoters: {$ne: this.userId}
  };

  return Listings.find(selector, {
    sort: {sourceTimestamp: -1}
  });
});
