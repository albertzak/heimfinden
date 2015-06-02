Util = {
  toggle: function(S, x) {
    S[x] = 1 - (S[x]|0);
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

  objectToArray: function(object) {
    var array = [];

    _.each(object, function(value, key) {
      if(value) { array.push(key); }
    });

    return array;
  }
};

// Return a copy of an object containing all but the blacklisted properties.
_.mixin({
  unpick: function (obj) {
    obj || (obj = {});    
    return _.pick(obj, _.difference(_.keys(obj), _.flatten(Array.prototype.slice.call(arguments, 1))));
  }
});
