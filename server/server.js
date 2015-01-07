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
    return title.replace('!', '')
            .toLowerCase();
  },

  link: function(link) {
    return link;
  }
};


Meteor.methods({
    scrape: function () {

        var base_url = "http://www.willhaben.at";
        var path = "/iad/immobilien/mietwohnungen/mietwohnung-angebote?&sort=0&areaId=117229&parent_areaid=900"

        http.get(base_url + path, Meteor.bindEnvironment(function(res) {
          res.pipe(iconv.decodeStream('ISO-8859-1')).collect(Meteor.bindEnvironment(function(e, body) {
            if(e) { throw(e); } else {

              $ = cheerio.load(body);
              
              var results = [];

              $('.media').each(function(i, el) {          
                results.push({
                  title: Sanitize.title($(el).find('.media-body a').text()),
                  m2:    Sanitize.number($(el).find('.info-2 .desc-left').text()),
                  price: Sanitize.number($(el).find('.info-2 .pull-right').text()),
                  image: $(el).find('.img-link img').attr('src'),
                  link:  Sanitize.link(base_url + $(el).find('.img-link').attr('href')),
                });
              });

              _.each(results, function(result) {
                listing = Listings.update({link: result.link}, result, {upsert: true});
              });

              console.log("Scraped", results.length, "listings from willhaben.at");
            }
          }));
        }));
    }
});
