
var iconv = Meteor.npmRequire('iconv-lite');
var http = Meteor.npmRequire('http');

var Sanitize = {
  number: function(number) {
    return parseFloat(number
            .split('.').join('')
            .replace('-', '')
            .replace(',', '.'));
  },

  title: function(title) {
    title = title.split('!').join('')
              .split('"').join('');

    return _.map(title.split(' '), function(word) {
      if(changeCase.isUpperCase(word.substr(0, 1))) {
        return changeCase.upperCaseFirst(changeCase.lowerCase(word));
      } else {
        return changeCase.lowerCase(word);
      }
    }).join(' ');
  },

  link: function(link) {
    return link;
  },

  plz: function(plz) {
    return plz.split(',')[0];
  },

  rooms: function(rooms) {
    return rooms.split(' ')[0];
  },

  searchBetween: function(str, start, end) {
    var regex = [
      start,
      '(.*?)',
      end].join('');
    regex = new RegExp(regex, 'g');
    return _.map(str.match(regex), function(result) {
      return result.substr(start.length, result.length-end.length-start.length);
    });
  },

  images: function(js) {
    return Sanitize.searchBetween(js, '"image":"', '","');
  }
};




var Scraper = {
  asyncFetch: function(url, callback) {
    http.get(url, Meteor.bindEnvironment(function(res) {
      res.pipe(iconv.decodeStream('ISO-8859-1')).collect(Meteor.bindEnvironment(function(e, body) {
        callback(e, cheerio.load(body));
      }));
    }));
  }
};
Scraper.fetch = Async.wrap(Scraper.asyncFetch);


Meteor.methods({
  scrape: function () {

    var base_url = "http://www.willhaben.at";
    var path = "/iad/immobilien/mietwohnungen/mietwohnung-angebote?&sort=0&areaId=117229&parent_areaid=900"

    $ = Scraper.fetch(base_url + path);
    
    var results = [];

    $('.media').each(function(i, el) {
      var listing_info = {
        title:  Sanitize.title($(el).find('.media-body a').text()),
        m2:     Sanitize.number($(el).find('.info-2 .desc-left').text()),
        price:  Sanitize.number($(el).find('.info-2 .pull-right').text()),
        image:  $(el).find('.img-link img').attr('src'),
        link:   Sanitize.link(base_url + $(el).find('.img-link').attr('href'))
      };

      // Debug, deep-crawl only with first listing
      if(i===0) {
        $$ = Scraper.fetch(listing_info.link);

        var listing_details = {
          street: $$('.box-body.bg-blue dd').text(),
          plz:    Sanitize.plz($$('.subHeading .mg-offset-0').text()),
          rooms:  Sanitize.rooms($$('.subHeading .mg-offset-2').text()),
          // agency:
          images: Sanitize.images($$('.galleria-container-wrapper script').text())
          // desc:
        };

        listing_info = _.extend(listing_info, listing_details);
      }
      // Debug end

      results.push(listing_info);
    });

    _.each(results, function(result) {
      listing = Listings.update({link: result.link}, result, {upsert: true});
    });

    console.log("Scraped", results.length, "listings from willhaben.at");
  }
});
