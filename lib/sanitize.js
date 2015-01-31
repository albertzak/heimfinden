Sanitize = {
  limits: {
    minSourceTimestamp: function() {
      return parseInt(moment().utc().subtract(10, 'days').format('X'));
    },
    minLastMatchTimestamp: function() {
      return parseInt(moment().utc().subtract(3, 'days').format('X'));
    },
    minPrice: 40,
    maxPrice: 1700,
    minPricem2: 2,
    maxPricem2: 25,
    minm2: 8,
    maxm2: 300,
    plz: [1010, 1030, 1040, 1060, 1070, 1080, 1090, 1170, 1180, 1190]
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
      Logger.log('danger', 'Listing validation failed because type, source, or url was missing', detail);

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
    return parseFloat(number
            .trim()
            .split(/\s/).join('')
            .replace('€', '')
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

