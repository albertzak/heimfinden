Meteor.startup(function () {
  Scrapers.register({
    'willhaben': {
      baseUrl: 'http://www.willhaben.at',

      resultsTasks: function() {

        var plzAreaIds = {
          1010: 117223,
          1030: 117225,
          1040: 117226,
          1060: 117228,
          1070: 117229,
          1080: 117230,
          1090: 117231,
          1170: 117239,
          1180: 117240,
          1190: 117241
        };

        var typeSlugs = {
          'Wohnung': 'mietwohnungen/mietwohnung-angebote?',
          'Lagerraum': 'gewerbeimmobilien-mieten/gewerbeimmobilien-angebote?PROPERTY_TYPE=7%3B18',
          'Geschäftslokal': 'gewerbeimmobilien-mieten/gewerbeimmobilien-angebote?PROPERTY_TYPE=10'
        };

        var makeUrl = function(typeSlug, areaId) {
          return [
            'http://www.willhaben.at/iad/immobilien/',
            typeSlug,
            '&parent_areaid=900&areaId=',
            areaId
          ].join('');
        };

        tasks = [];

        _.each(typeSlugs, function(typeSlug, type) {
          _.each(plzAreaIds, function(areaId, plz) {
            tasks.push({
              url: makeUrl(typeSlug, areaId),
              plz: plz,
              type: type,
            });
          });  
        })

        return tasks;
      }(),

      resultSelector: '.media',
      parseResult: function($, el) {
        return {
          url:   'http://www.willhaben.at' + $(el).find('.img-link').attr('href'),
          detail: {
            agency: $(el).find('.media-body .bot-1').html().split('<br>')[1].trim(),
          }
        };
      },

      parseDetail: function($$) {
        return {
          title:  Sanitize.title($$('head title').text()),
          price:  Sanitize.number($$('#priceBox-price').text()),
          m2:     function() {
            return Sanitize.number($$('h1.header .mg-offset-1').text()) ||
            Sanitize.number($$('span:contains("Grundfläche")').last().siblings('div').text());
          }(),
          street: $$('.box-body.bg-blue dd').html().split('<br>')[0],
          rooms:  parseInt($$('.subHeading .mg-offset-2').text().match(/\d+/)),
          images: function() {
            if ($$('.galleria.off img.sg-image').length) {
              return [$$('.galleria.off img.sg-image').attr('src')];
            } else {
              return Util.findBetween(
                $$('.galleria-container-wrapper script').text(),
                '"image":"',
                '","');
            }
          }(),
          sourceTimestamp: function() {
            date = $$('#advert-info-dateTime').html();
            date = date.trim().replace('Zuletzt geändert: ', '');
            date = moment.tz(date, 'DD.MM.YYYY HH:mm', 'Europe/Vienna');
            return parseInt(date.format('X'));
          }()
        };
      }
    }
  });
});
