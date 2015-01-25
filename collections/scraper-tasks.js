ScraperStatus = new Meteor.Collection('scraperStatus');
ScraperTasks = new Meteor.Collection('scraperTasks');
ScraperTasksBlacklist = new Meteor.Collection('scraperTasksBlacklist');

ScraperStatus.set = function(status, payload) {
  if (typeof payload === 'undefined') { payload = {}; }
  payload = _.extend(payload, { status: status });

  if (ScraperStatus.find().count() != 1) {
    ScraperStatus.remove({});
    return ScraperStatus.insert(payload);
  }

  oldPayload = ScraperStatus.get();
  payload = _.extend(oldPayload, { status: status });
  return ScraperStatus.update({}, payload);
}

ScraperStatus.get = function() {
  if (ScraperStatus.find().count() == 0) {
    ScraperStatus.insert({ status: 'Initializing', paused: false });
  }

  return ScraperStatus.findOne();
}

ScraperStatus.isPaused = function() {
  return ScraperStatus.get().paused || false;
}

ScraperTasks.register = function(payload) {
  if (payload instanceof Array) {
    _.each(payload, function(task) {
      ScraperTasks.register(task);
    })
  } else {
    ScraperTasks.insert({
      payload: payload,
      addedTimestamp: parseInt(moment().format('X'))
    });
  }
}

ScraperTasks.getRandomTask = function() {
  var collection = ScraperTasks.find().fetch();
  var randomIndex = Math.floor(Math.random() * collection.length);
  return collection[randomIndex];
}


ScraperTasksBlacklist.register = function(payload) {
  if (payload instanceof Array) {
    _.each(payload, function(task) {
      ScraperTasksBlacklist.register(task);
    })
  } else {
    if(ScraperTasksBlacklist.findOne({ 'payload.url': payload.url })) {

      ScraperTasksBlacklist.update({
        'payload.url': payload.url
      }, {
        payload: payload,
        lastMatchTimestamp: parseInt(moment().format('X')),
      });

    } else {
      ScraperTasksBlacklist.insert({
        payload: payload,
        addedTimestamp: parseInt(moment().format('X'))
      });
    }
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
      lastMatchTimestamp: parseInt(moment().format('X'))
    });

    return true;
  } else {
    return false;
  }
}

