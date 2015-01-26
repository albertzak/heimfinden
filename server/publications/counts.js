Meteor.publish('counts', function(selector) {
  if (typeof selector === 'undefined')
    selector = {};

  var l = Listings.find(_.extend(selector, {
    upvoters:   {$ne: this.userId},
    downvoters: {$ne: this.userId},
  }));

  Counts.publish(this, 'nextListingsCount', l, { noReady: true });

  Counts.publish(this, 'upvotedListingsCount',   Listings.find(_.extend(selector, { upvoters:   this.userId})), { noReady: true });

  Counts.publish(this, 'listingsAddedLastHourCount', Listings.find({
    scrapedTimestamp: { $gt: parseInt(moment().subtract(1, 'hour').format('X')) }
  }), { noReady: true });

  Counts.publish(this, 'loggerCount', Logger.find({}));
});
