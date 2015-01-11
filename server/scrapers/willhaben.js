Meteor.startup(function () {
  Scrapers.register({
    'willhaben': {
      baseUrl: 'http://www.willhaben.at',

      basicTargets: function() {

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

        targets = [];

        _.each(typeSlugs, function(typeSlug, type) {
          _.each(plzAreaIds, function(areaId, plz) {
            targets.push({
              url: makeUrl(typeSlug, areaId),
              plz: plz,
              type: type,
            });
          });  
        })

        return targets;
      }(),



      resultSelector: '.media',
      expectedResultsCount: 25,
      parseResult: function($, el) {
        return {
          title:  Sanitize.title($(el).find('.media-body a').text()),
          plz:    parseInt($('.media-body .bot-1').text().match(/\d{4}/)),
          m2:     Sanitize.number($(el).find('.info-2 .desc-left').text()),
          price:  Sanitize.number($(el).find('.info-2 .pull-right').text()),
          agency: $(el).find('.media-body .bot-1').html().split('<br>')[1].trim(),
          image:  $(el).find('.img-link img').attr('src'),
          url:   'http://www.willhaben.at' + $(el).find('.img-link').attr('href')
        };
      },

      parseDetail: function($$) {
        return {
          street: $$('.box-body.bg-blue dd').html().split('<br>')[0],
          rooms:  parseInt($$('.subHeading .mg-offset-2').text().match(/\d+/)),
          images: Util.findBetween($$('.galleria-container-wrapper script').text(), '"image":"', '","'),
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
