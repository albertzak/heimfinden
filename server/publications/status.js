Meteor.publish('scraperStatus', function() {
  Counts.publish(this, 'scraperTasksCount', ScraperTasks.find({}), { noReady: true });
  Counts.publish(this, 'scraperTasksAddedLastHourCount', ScraperTasks.find({
    addedTimestamp: {$gt: parseInt(moment().subtract(1, 'hour').format('X')) }
  }), { noReady: true });

  Counts.publish(this, 'scraperTasksBlacklistCount', ScraperTasksBlacklist.find({}), { noReady: true });
  Counts.publish(this, 'scraperTasksBlacklistAddedLastHourCount', ScraperTasksBlacklist.find({
    addedTimestamp: {$gt: parseInt(moment().subtract(1, 'hour').format('X'))}
  }), { noReady: true });
  Counts.publish(this, 'scraperTasksMatchedLastHourCount', ScraperTasksBlacklist.find({
    lastMatchTimestamp: {$gt: parseInt(moment().subtract(1, 'hour').format('X'))}
  }), { noReady: true });

  return ScraperStatus.find({});
});

Meteor.publish('logger', function() {
  return Logger.find({}, { sort: { timestamp: -1 }, limit: 10 });
});
