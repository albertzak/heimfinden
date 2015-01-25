iconv = Meteor.npmRequire('iconv-lite');
http = Meteor.npmRequire('http');

Meteor.methods({
  scraperPause: function() {
    Scraper.pause();
  },

  scraperUnpause: function() {
    Scraper.unpause();
  },

  clearLogs: function() {
    Logger.remove({});
  }
});
