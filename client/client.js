
Template.listings.helpers({
  listings: function () {
    return Listings.find();
  }
});

Template.refresh.events({
  'click button': function () {
    Meteor.call('scrape', function (error, result) {
      if (error) {
        console.log(error);
        throw new Meteor.Error(500, error);
      }
    });
  }
});
