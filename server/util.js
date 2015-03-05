ScraperUtil = {
  asyncFetch: function(url, sourceEncoding, callback) {
    if (typeof sourceEncoding === 'undefined')
      sourceEncoding = 'UTF-8';

    var options = {
      headers: {
        'User-Agent':      'Chrome',
        'Accept':          'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'de-AT',
        'Cache-Control':   'max-age=0'
      }
    };

    request(url, options).pipe(iconv.decodeStream(sourceEncoding)).collect(Meteor.bindEnvironment(function(e, body) {
      callback(e, cheerio.load(body));
    }));
  }

};

ScraperUtil.fetch = Async.wrap(ScraperUtil.asyncFetch);
