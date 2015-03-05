Meteor.startup(function () {
  Scrapers.register({
    'provisionsfrei': {
      baseUrl: 'http://www.provisionsfrei.at/',

      resultsTasks: function() {

        var locationIds = [
          9010117223, // 1010
          9030117225, // 1030
          9040117226, // 1040
          9040117228, // 1060
          9040117229, // 1070
          9040117230, // 1080
          9040117231, // 1090
          9170117239, // 1170
          9170117240, // 1180
          9170117241, // 1190
        ];

        var locationIdSlug = locationIds.join('-');

        var typeSlugs = {
          'Wohnung': 'mietwohnung-provisionsfrei/treffer?isdynamicsearch=True&locationids=',
          'Geschäftslokal': 'geschaeftslokal-mieten-provisionsfrei/treffer?isdynamicsearch=True&locationids='
        };

        var makeUrl = function(typeSlug) {
          return [
            'http://www.provisionsfrei.at/',
            typeSlug,
            locationIdSlug,
          ].join('');
        };

        tasks = [];

        _.each(typeSlugs, function(typeSlug, type) {
          tasks.push({
            url: makeUrl(typeSlug),
            type: type,
          });
        })

        return tasks;
      }(),

      resultSelector: '.result-item>div:only-child',
      parseResult: function($, el) {
        var p = $(el).find('p>strong:only-child').parent();
        return {
          url: $(el).find('a').first().attr('href'),
          detail: {
            m2:     Sanitize.number($(p[0]).text()),
            price:  Sanitize.number($(p[1]).text()),
            plz:    Sanitize.number($(p[2]).text()),
            agency: 'Privat'
          }
        };
      },

      isNoLongerListed: function($) {
        return false;
      },

      isPending: function($) {
        return false;
      },

      parseDetail: function($$) {
        return {
          title:  Sanitize.title($$('.details-title-h1').text()),
          images: function() {
            var images = $$('#SerializedPictures');
            if (images.length > 0) {
              images = JSON.parse(images.val());
              images = _.map(images, function(image) { return image.PreviewBig; });
              return images;
            } else {
              return [];
            }
          }(),
          sourceTimestamp: function() {
            return Math.floor(Date.now() / 1000);
          }()
        };
      }
    }
  });
});
