
Template.listings.helpers({
  listings: function () {
    return Listings.find();
  }
});

UI.registerHelper('formatTime', function(context, options) {
  if(context)
    return moment(context, 'X').format('DD.MM.YYYY HH:mm');
  else
    return 'never';
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
