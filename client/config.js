Accounts.ui.config({
  requestPermissions: {
    facebook: ['email', 'user_friends'],
  },
  extraSignupFields: []
});

Deps.autorun(function() {
  if(Meteor.userId()){
    try {
      UserStatus.startMonitor({
        threshold: 60000,
        interval: 10000,
        idleOnBlur: true
      });
    } catch(e) {}
  }
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
