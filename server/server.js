iconv = Meteor.npmRequire('iconv-lite');
http = Meteor.npmRequire('http');

Meteor.methods({
  scrape: function(force) {
    Scraper.run(force);
  }
});
