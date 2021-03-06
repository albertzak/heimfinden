Meteor.publish('counts', function(selector) {
  if (typeof selector === 'undefined')
    selector = {};
  
  if (this.userId && Meteor.users.findOne(this.userId))
    var friends = Meteor.users.findOne(this.userId).friends || [];
  else
    var friends = [];

  Counts.publish(this, 'nextListingsCount', Listings.find(_.extend(selector, {
    upvoters:   [],
    downvoters: [],
  })), { noReady: true });

  Counts.publish(this, 'nextListingsUnfilteredCount', Listings.find({
    upvoters:   [],
    downvoters: [],
  }), { noReady: true });

  Counts.publish(this, 'allListingsCount', Listings.find(), { noReady: true });

  Counts.publish(this, 'upvotedListingsCount', Listings.find(_.extend(selector, {
    'upvoters': {$not: {$size: 0}},
    'downvoters': []
  })), { noReady: true });

  Counts.publish(this, 'friendsListingsCount', Listings.find(_.extend(selector, {
    upvoters:   {$in: friends},
    downvoters: []
  })), { noReady: true });

  Counts.publish(this, 'listingsAddedLastHourCount', Listings.find({
    scrapedTimestamp: { $gt: parseInt(moment().subtract(1, 'hour').format('X')) }
  }), { noReady: true });

  Counts.publish(this, 'loggerCount', Logger.find({}));
});
