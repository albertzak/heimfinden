Sanitize = {
  number: function(number) {
    return parseFloat(number
            .split('.').join('')
            .replace('-', '')
            .replace(',', '.'));
  },

  title: function(title) {
    title = title.split('!').join('')
              .split('"').join('');

    return _.map(title.split(' '), function(word) {
      if(changeCase.isUpperCase(word.substr(0, 1))) {
        return changeCase.upperCaseFirst(changeCase.lowerCase(word));
      } else {
        return changeCase.lowerCase(word);
      }
    }).join(' ');
  },

  findBetween: function(str, start, end) {
    var regex = [
      start,
      '(.*?)',
      end].join('');
    regex = new RegExp(regex, 'g');
    return _.map(str.match(regex), function(result) {
      return result.substr(start.length, result.length-end.length-start.length);
    });
  },
};

