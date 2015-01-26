Meteor.publish(null, function() {
  Counts.publish(this, 'nextListingsCount', Listings.find({
    upvoters:   {$ne: this.userId},
    downvoters: {$ne: this.userId},
  }));

  Counts.publish(this, 'upvotedListingsCount',   Listings.find({ upvoters: this.userId}));
  Counts.publish(this, 'downvotedListingsCount', Listings.find({ downvoters: this.userId}));

  Counts.publish(this, 'loggerCount', Logger.find({}));
});

Meteor.publish('nextListings', function() {
  var selector = {
    upvoters:   {$ne: this.userId},
    downvoters: {$ne: this.userId},
  };

  return Listings.find(selector, {
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

Meteor.publish('friendsListings', function() {
  return Listings.find({}, { sort: { sourceTimestamp: 1 }});
});

Meteor.publish('scraperStatus', function() {
  return ScraperStatus.find({});
});

Meteor.publish('logger', function() {
  return Logger.find({}, { sort: { timestamp: -1 }, limit: 10 });
})

Meteor.publish('scraperTasks', function() {
  Counts.publish(this, 'listingsAddedLastHourCount', Listings.find({
    scrapedTimestamp: { $gt: parseInt(moment().subtract(1, 'hour').format('X')) }
  }), { noReady: true });
  Counts.publish(this, 'scraperTasksCount', ScraperTasks.find({}), { noReady: true });
  Counts.publish(this, 'scraperTasksAddedLastHourCount', ScraperTasks.find({
    addedTimestamp: {$gt: parseInt(moment().subtract(1, 'hour').format('X')) }
  }), { noReady: true });

  return ScraperTasks.find({}, {
    sort: { addedTimestamp: -1 },
    limit: 5
  });
});

Meteor.publish('scraperTasksBlacklist', function() {
  Counts.publish(this, 'scraperTasksBlacklistCount', ScraperTasksBlacklist.find({}), { noReady: true });
  Counts.publish(this, 'scraperTasksBlacklistAddedLastHourCount', ScraperTasksBlacklist.find({
    addedTimestamp: {$gt: parseInt(moment().subtract(1, 'hour').format('X'))}
  }), { noReady: true });
  Counts.publish(this, 'scraperTasksMatchedLastHourCount', ScraperTasksBlacklist.find({
    lastMatchTimestamp: {$gt: parseInt(moment().subtract(1, 'hour').format('X'))}
  }), { noReady: true });

  return ScraperTasksBlacklist.find({}, {
    sort: { addedTimestamp: -1 },
    limit: 5
  });
});
