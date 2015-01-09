Meteor.startup(function () {
  Scraper.register({
    name:    'willhaben',
    baseUrl: 'http://www.willhaben.at',
    url:     'http://www.willhaben.at/iad/immobilien/mietwohnungen/mietwohnung-angebote?&sort=0&areaId=117229&parent_areaid=900',

    resultSelector: '.media',
    parseResult: function($, el) {
      return {
        title:  Sanitize.title($(el).find('.media-body a').text()),
        plz:    parseInt($('.media-body .bot-1').text().match(/\d{4}/)),
        m2:     Sanitize.number($(el).find('.info-2 .desc-left').text()),
        price:  Sanitize.number($(el).find('.info-2 .pull-right').text()),
        agency: $(el).find('.media-body .bot-1').html().split('<br>')[1].trim(),
        image:  $(el).find('.img-link img').attr('src'),
        link:   'http://www.willhaben.at' + $(el).find('.img-link').attr('href')
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

  });
});
