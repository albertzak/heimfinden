iconv = Meteor.npmRequire('iconv-lite');
http = Meteor.npmRequire('http');

Meteor.methods({
  cacheFbFriends: function(fbFriends) {
    if (fbFriends === [] || typeof fbFriends === 'undefined') { return false; }
    if ( ! Meteor.userId()) { return false; }

    fbIds   = _.map(fbFriends, function(f) { return f.id });
    userIds = _.map(fbIds, function(fbId) { 
      return Meteor.users.findOne({'services.facebook.id': fbId})._id;
    });

    Meteor.users.update({_id: Meteor.userId()}, {
      $set: {friends: userIds}
    });
  },

  scraperPause: function() {
    Scraper.pause();
  },

  scraperUnpause: function() {
    Scraper.unpause();
  },

  clearLogs: function() {
    Logger.remove({});
  }
});
