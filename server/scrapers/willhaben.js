Meteor.startup(function () {
  Scrapers.register({
    'willhaben': {
      baseUrl: 'http://www.willhaben.at',
      sourceEncoding: 'ISO-8859-1',

      resultsTasks: function() {

        var ortSlugs = {
          'Bruck-Mürzzuschlag': 'bruck-muerzzuschlag',
          'Deutschlandsberg': 'deutschlandsberg',
          'Graz': 'graz',
          'Graz-Umgebung': 'graz-umgebung',
          'Hartberg-Fürstenfeld': 'hartberg-fuerstenfeld',
          'Leibnitz': 'leibnitz',
          'Leoben': 'leoben',
          'Liezen': 'liezen',
          'Murau': 'murau',
          'Murtal': 'murtal',
          'Südoststeiermark': 'südoststeiermark',
          'Voitsberg': 'voitsberg',
          'Weiz': 'weiz'
        };


        var makeUrl = function(slug) {
          return [
            'http://www.willhaben.at/iad/immobilien/mietwohnungen/steiermark/',
            slug
          ].join('');
        };

        tasks = [];

        _.each(ortSlugs, function(slug, ort) {
          tasks.push({
            url: makeUrl(slug),
            plz: ort,
            type: 'Mietwohnung',
          });
        });

        return tasks;
      }(),

      resultSelector: '.media',
      parseResult: function($, el) {
        return {
          url:   'http://www.willhaben.at' + $(el).find('.img-link').attr('href'),
          detail: {
            agency: $(el).find('.media-body .bot-1').html() && $(el).find('.media-body .bot-1').html().split('<br>')[1].trim(),
          }
        };
      },

      isNoLongerListed: function($) {
        return ($('body').text().indexOf('Neue passende Anzeigen zu Ihrer Suche') > 0)
      },

      isPending: function($) {
        return (($('body').text().indexOf('befindet sich in der Warteschlange') > 0) || ($('body').text().indexOf('Die Anzeige wartet auf Aktivierung') > 0));
      },

      parseDetail: function($$) {
        return {
          title:  Sanitize.title($$('head title').text()),
          price:  Sanitize.number($$('#priceBox-price').text()),
          m2:     function() {
            return Sanitize.number($$('h1.header .mg-offset-1').text()) ||
            Sanitize.number($$('span:contains("Grundfläche")').last().siblings('div').text());
          }(),
          street: function() {
            if ($$('.box-body.bg-blue dd').length > 0)
              return $$('.box-body.bg-blue dd').html().split('<br>')[0];
          }(),
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
