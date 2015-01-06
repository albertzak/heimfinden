
Template.listings.helpers({
  listings: function () {
    return Session.get('listings')
  }
});

Template.listings.events({
  'click button': function () {
    Meteor.call('scrape', function (error, result) {
      if (error) {
        console.log(error);
      } else {
        console.log(result);
        Session.set('listings', result);
      }
    });
  }
});
