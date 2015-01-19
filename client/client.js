UI.registerHelper('simpleHumanTime', function(context, options) {
  if(context)
    return moment(context, 'X').format('DD.MM.YYYY HH:mm');
  else
    return '';
});

UI.registerHelper('humanTime', function(context, options) {
  if(context)
    return moment(context, 'X').format('[um] HH:mm [Uhr, am] DD.MM.YYYY');
  else
    return '';
});

UI.registerHelper('isoTime', function(context, options) {
  if(context)
    return moment(context, 'X').toISOString();
  else
    return '';
});

UI.registerHelper('activeClass', function(context, options) {
  if(context === Router.current().route.path())
    return {class: 'active'};
});

UI.registerHelper('profilePicture', function(context, options) {
  if(context && context.services && context.services.facebook && context.services.facebook.id) {
    return 'http://graph.facebook.com/'
            + context.services.facebook.id
            + "/picture/?type=square";
  }
});

Meteor.startup(function() {
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
});
