ScraperTasks = new Meteor.Collection('scraperTasks');
ScraperTasksBlacklist = new Meteor.Collection('scraperTasksBlacklist');

ScraperTasks.register = function(payload) {
  if(payload instanceof Array) {
    _.each(payload, function(task) {
      ScraperTasks.register(task);
    })
  } else {
    ScraperTasks.update({
      'payload.url': payload.url
    },{
      payload: payload,
      addedTimestamp: moment().format('X')
    },{upsert: true});
  }
}

ScraperTasks.getRandomTask = function() {
  var collection = ScraperTasks.find().fetch();
  var randomIndex = Math.floor(Math.random() * collection.length);
  return collection[randomIndex];
}


ScraperTasksBlacklist.register = function(payload) {
  if(payload instanceof Array) {
    _.each(payload, function(task) {
      ScraperTasksBlacklist.register(task);
    })
  } else {
    ScraperTasksBlacklist.update({
      'payload.url': payload.url
    },{
      payload: payload,
      addedTimestamp: moment().format('X'),
      lastMatchTimestamp: moment().format('X')
    },{upsert: true});
  }
}

ScraperTasksBlacklist.match = function(payload) {
  var entry = ScraperTasksBlacklist.findOne({
    'payload.url': payload.url
  });

  if (entry) {
    ScraperTasksBlacklist.update({
      'payload.url': payload.url
    },{
      lastMatchTimestamp: moment().format('X')
    });

    return true;
  } else {
    return false;
  }
}

