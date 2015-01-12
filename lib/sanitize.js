Sanitize = {
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

