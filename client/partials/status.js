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
  },

  scraperTasks: function() {
    return ScraperTasks.find({}, {
      sort: { addedTimestamp: -1 },
      limit: 10});
  },

  scraperTasksCount: function() {
    return ScraperTasks.find({}).count();
  },

  listingsCount: function() {
    return Listings.find().count();
  },

  hasScraperTasks: function() {
    return (ScraperTasks.find({}).count() !== 0);
  },

  stringify: function(obj) {
    return JSON.stringify(obj);
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
