Accounts.ui.config({
  requestPermissions: {
    facebook: ['email', 'user_friends'],
  },
  extraSignupFields: []
});

Meteor.startup(function () {  
  Users._ensureIndex({
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
    'upvoters': 1,
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

moment.locale('de', {
  relativeTime : {
    future: "in %s",
    past:   "vor %s",
    s:  "5 Sekunden",
    m:  "einer Minute",
    mm: "%d Minuten",
    h:  "einer Stunde",
    hh: "%d Stunden",
    d:  "einem Tag",
    dd: "%d Tagen",
    M:  "einem Monat",
    MM: "%d Monaten",
    y:  "einem Jahr",
    yy: "%d Jahren"
  }
});
