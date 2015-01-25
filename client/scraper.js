Template.scraper.events({
  'click .pause': function() {
    Meteor.call('scraperPause');
  },
  'click .unpause': function() {
    Meteor.call('scraperUnpause');
  },
  'click .clear-logs': function() {
    Meteor.call('clearLogs');
  }
});
