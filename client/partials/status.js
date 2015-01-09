Template.status.helpers({
  statuses: function() {
    return Status.find({}, {
      sort: { timestamp: -1 },
      limit: 60});
  },

  lastText: function() {
    var last = Status.findOne({}, {
      sort: { timestamp: -1 }});

    return last && last.text;
  },

  lastTimestamp: function() {
    var last = Status.findOne({}, {
      sort: { timestamp: -1 }});

    return last && last.timestamp;
  }
});

Template.status.events({
  'click button.force.refresh': function () {
    Meteor.call('scrape', function (error, result) {
      if (error) {
        console.log(error);
        throw new Meteor.Error(500, error);
      }
    });
  },
});
