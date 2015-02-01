Template.scraper.events({
  'click .pause': function() {
    Meteor.call('scraperPause');
  },
  'click .unpause': function() {
    Meteor.call('scraperUnpause');
  },
  'click .clear-logs': function() {
    Meteor.call('clearLogs');
  },
  'click .run-cleaner': function() {
    Meteor.call('runCleaner');
  }
});
