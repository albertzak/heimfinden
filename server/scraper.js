request = Meteor.npmRequire('request');

Scrapers = {};

Scraper = {
  all: [],

  register: function(name) {
    Scraper.all.push(name);
  },

  each: function(iterate) {
    _.each(Scraper.all, function(scraper) {
      return iterate(scraper);
    });
  },

  run: function(force) {
    if (typeof force === 'undefined') { force = false; }
    console.log('Running all', Scraper.all.length, 'scrapers');
    Scraper.each(function(scraper) {
      Scraper.run_single(scraper);
    });
  },

  run_single: function(scraper) {
    console.log("Running scraper", scraper.name);
    $ = Scraper.fetch(scraper.url);
    var results = [];

    $(scraper.resultSelector).each(function(i, el) {
      var listingInfo = scraper.parseResult($, el);
      
      listingInfo = _.extend(listingInfo, {
        scrapeSource: scraper.name,
        scrapeTimestamp: Math.floor(Date.now() / 1000)
      });

      if((typeof listingInfo.detailsTimestamp === 'undefined') || force) {
        $$ = Scraper.fetch(listingInfo.link);
        listingInfoDetail = scraper.parseDetail($$);
        listingInfoDetail = _.extend(listingInfoDetail, {
          detailTimestamp: Math.floor(Date.now() / 1000),
        });
        listingInfo = _.extend(listingInfo, listingInfoDetail);
      }

      results.push(listingInfo);
    });

    _.each(results, function(result) {
      listing = Listings.update({link: result.link}, result, {upsert: true});
    });

    console.log("Scraped", results.length, "listings from willhaben.at");
  },

  asyncFetch: function(url, callback) {
    var options = {
      headers: {
        'User-Agent':      'Chrome',
        'Accept':          'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'de-AT',
        'Cache-Control':   'max-age=0'
      }
    };

    request(url, options).pipe(iconv.decodeStream('ISO-8859-1')).collect(Meteor.bindEnvironment(function(e, body) {
      callback(e, cheerio.load(body));
    }));
  }

};

Scraper.fetch = Async.wrap(Scraper.asyncFetch);
