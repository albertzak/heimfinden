Meteor.startup(function () {  
  Meteor.users._ensureIndex({
    'services.facebook.first_name': 1,
    'services.profile.name': 1
  });

  Listings._ensureIndex({
    'price': 1,
    'm2': 1,
    'pricem2': 1,
    'url': 1,
    'plz': 1,
    'type': 1,
    'downvoters': 1,
    'sourceTimestamp': 1,
  });

  ScraperStatus._ensureIndex({
    'paused': 1,
  });

  ScraperTasks._ensureIndex({
    'payload.url': 1,
  });

  ScraperTasksBlacklist._ensureIndex({
    'payload.url': 1,
    'addedTimestamp': 1,
    'lastMatchTimestamp': 1,
  });
});
