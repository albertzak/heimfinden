Sanitize = {
  limits: {
    minSourceTimestamp: function() {
      return parseInt(moment().utc().subtract(4, 'days').format('X'));
    },
    minLastMatchTimestamp: function() {
      return parseInt(moment().utc().subtract(8, 'days').format('X'));
    },
    minPrice: 40,
    maxPrice: 1500,
    minPricem2: 2,
    maxPricem2: 25,
    minm2: 8,
    maxm2: 130,
    plz: ['Bruck-Mürzzuschlag', 'Deutschlandsberg', 'Graz', 'Graz-Umgebung', 'Hartberg-Fürstenfeld', 'Leibnitz', 'Leoben', 'Liezen', 'Murau', 'Murtal', 'Südoststeiermark', 'Voitsberg', 'Weiz']
  },

  validateDetail: function(detail) {
    return Sanitize.validatePresence(detail) && Sanitize.validateLimits(detail);
  },

  validatePresence: function(detail) {
    var validBasic = detail.m2 && detail.price && true;

    var validTask  = detail.plz
      && detail.type
      && detail.source
      && detail.url
      && true;

    var validTimestamp = detail.sourceTimestamp
      && (Sanitize.limits.minSourceTimestamp() < detail.sourceTimestamp);

    var validPhotos = (detail.images.length > 0);

    if (! validTask)
      Logger.log('danger', 'Listing validation failed because plz, type, source, or url was missing', detail);

    if (! detail.sourceTimestamp)
      Logger.log('danger', 'Discarding listing with no timestamp', detail);

    return validBasic && validTask && validTimestamp && validPhotos;
  },

  validateLimits: function(detail) {
    return ((Sanitize.limits.minPrice   <= detail.price)
         && (Sanitize.limits.maxPrice   >= detail.price)
         && (Sanitize.limits.minm2      <= detail.m2)
         && (Sanitize.limits.maxm2      >= detail.m2)
         && (Sanitize.limits.minPricem2 <= detail.pricem2)
         && (Sanitize.limits.maxPricem2 >= detail.pricem2)
         && _.include(Sanitize.limits.plz, detail.plz));
  },

  number: function(number) {
    if (number.indexOf(':') >= 0)
      number = number.split(':')[1];

    return parseFloat(number
            .trim()
            .split(/\s/).join('')
            .replace('€', '')
            .replace('m²', '')
            .split('.').join('')
            .replace('-', '')
            .replace(',', '.'));
  },

  title: function(title) {
    title = title
            .split('!').join('')
            .split('*').join('')
            .split('"').join('');

    return _.map(title.split(' '), function(word) {
      if(changeCase.isUpperCase(word.substr(0, 1))) {
        return changeCase.upperCaseFirst(changeCase.lowerCase(word));
      } else {
        return changeCase.lowerCase(word);
      }
    }).join(' ');
  }
};

