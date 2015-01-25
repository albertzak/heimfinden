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

Meteor.publish('scraperStatus', function() {
  return ScraperStatus.find({});
});

Meteor.publish('logger', function() {
  return Logger.find({}, { sort: { timestamp: -1 }, limit: 10 });
})

Meteor.publish('scraperTasks', function() {
  Counts.publish(this, 'listingsAddedTodayCount', Listings.find({
    scrapedTimestamp: { $gt: parseInt(moment().subtract(24, 'hours').format('X')) }
  }));
  Counts.publish(this, 'scraperTasksCount', ScraperTasks.find({}));
  Counts.publish(this, 'scraperTasksAddedTodayCount', ScraperTasks.find({
    addedTimestamp: {$gt: parseInt(moment().subtract(24, 'hours').format('X')) }
  }));

  return ScraperTasks.find({}, {
    sort: { addedTimestamp: -1 },
    limit: 5
  });
});

Meteor.publish('scraperTasksBlacklist', function() {
  Counts.publish(this, 'scraperTasksBlacklistCount', ScraperTasksBlacklist.find({}));
  Counts.publish(this, 'scraperTasksBlacklistAddedTodayCount', ScraperTasksBlacklist.find({
    addedTimestamp: {$gt: parseInt(moment().subtract(24, 'hours').format('X'))}
  }));
  Counts.publish(this, 'scraperTasksMatchedTodayCount', ScraperTasksBlacklist.find({
    lastMatchTimestamp: {$gt: parseInt(moment().subtract(24, 'hours').format('X'))}
  }));

  return ScraperTasksBlacklist.find({}, {
    sort: { addedTimestamp: -1 },
    limit: 5
  });
});
