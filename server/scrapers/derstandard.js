Meteor.startup(function () {
  Scrapers.register({
    'derStandard': {
      baseUrl: 'http://derstandard.at/Immobilien/',
      sourceEncoding: 'UTF-8',

      resultsTasks: function() {

        var plzSlugs = {
          1010: 'wien--1.--innere-stadt',
          1030: 'wien--3.--landstraße',
          1040: 'wien--4.--wieden',
          1060: 'wien--6.--mariahilf',
          1070: 'wien--7.--neubau',
          1080: 'wien--8.--josefstadt',
          1090: 'wien--9.--alsergrund',
          1170: 'wien--17.--hernals',
          1180: 'wien--18.--währing',
          1190: 'wien--19.--döbling',
        };

        var typeSlugs = {
          'Wohnung': 'Suche/mieten/wohnung/wien/',
          'Gewerbeimmobilie': 'Suche/mieten/gewerbeimmobilie/wien/'
        };

        var makeUrl = function(typeSlug, plzSlug) {
          return [
            'http://derstandard.at/Immobilien/',
            typeSlug,
            plzSlug
          ].join('');
        };

        tasks = [];

        _.each(typeSlugs, function(typeSlug, type) {
          _.each(plzSlugs, function(plzSlug, plz) {
            tasks.push({
              url: makeUrl(typeSlug, plzSlug),
              plz: plz,
              type: type,
            });
          });  
        })

        return tasks;
      }(),

      resultSelector: '.DetailLink',
      parseResult: function($, el) {
        var slug = [$(el).attr('data-id'), $(el).attr('data-objnr')].join('/');
        var url  = 'http://derstandard.at/Immobilien/Suche/Detail/' + slug;
        return { url: url };
      },

      isNoLongerListed: function($) {
        return false;
      },

      isPending: function($) {
        return false;
      },

      parseDetail: function($$) {
        return {
          title:  Sanitize.title($$('.InseratTitel').text()),
          price:  Sanitize.number($$('.mietePreis').text()),
          m2:     Sanitize.number($$('.flaeche').text()),
          rooms:  Sanitize.number($$('.zimmer').text()),

          plz:    function() {
            var slugsPlz = {
              'wien--1.--innere-stadt': 1010,
              'wien--3.--landstraße':   1030,
              'wien--4.--wieden':       1040,
              'wien--6.--mariahilf':    1060,
              'wien--7.--neubau':       1070,
              'wien--8.--josefstadt':   1080,
              'wien--9.--alsergrund':   1090,
              'wien--17.--hernals':     1170,
              'wien--18.--währing':     1180,
              'wien--19.--döbling':     1190,
              'wien-17.--hernals':      1170,
              'wien-18.--währing':      1180,
              'wien-19.--döbling':      1190,
            };

            var result = $$('.Block.Ort').text()
              .trim().toLowerCase()
              .split(' ').join('-')
              .split(',').join('-');

            result = slugsPlz[result];

            return result;
          }(),

          street: function() {
            if ($$(':contains(Adresse:)').length > 0)
              return $$(':contains(Adresse:)').last().siblings('.Bd_Value').text();
            else if ($$(':contains(Nähe/Lage:)').length > 0)
              return $$(':contains(Nähe/Lage:)').last().siblings('.Bd_Value').text();
          }(),

          agency: function() {
            if ($$(':contains(Anbieter:)').length > 0)
              var agency = $$(':contains(Anbieter:)').last().siblings('.Bd_Value').text();
              if (agency === 'Privatperson')
                return 'Privat';
              else  
                return agency;
          }(),

          images: function() {
            if ($$('.Detailansicht script').length > 0) {
              var images = $$('.Detailansicht script').first().text();
              images = images.split('"');
              images = _.filter(images, function(s) {
                return (s.indexOf('.jpg') > 0);
              });
              images = _.map(images, function(path) {
                return 'http://images.derstandard.at/' + path;
              });

              return images;
            } else {
              return [];
            }
          }(),

          sourceTimestamp: function() {
            return parseInt(moment().format('X'));
          }()
        };
      }
    }
  });
});
