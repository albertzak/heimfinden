Sanitize = {
  limits: {
    minSourceTimestamp: function() {
      return parseInt(moment().utc().subtract(20, 'days').format('X'));
    },
  },

  validateDetail: function(detail) {
    var validBasic = detail.m2 && detail.price && true;

    var validTask  = detail.plz
      && detail.type
      && detail.source
      && detail.url
      && true;

    var validTimestamp = detail.sourceTimestamp
      && (Sanitize.limits.minSourceTimestamp() < detail.sourceTimestamp);

    if (! validTask)
      console.log('INFO', 'Listing validation failed because type, source, or url was missing', detail);

    if (! detail.sourceTimestamp)
      console.log('INFO', 'Discarding listing with no timestamp', detail);

    return validBasic && validTask && validTimestamp;
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

