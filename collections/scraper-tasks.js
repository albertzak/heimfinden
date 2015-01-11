ScraperTasks = new Meteor.Collection('scraperTasks');

ScraperTasks.register = function(payload) {
  if(payload instanceof Array) {
    _.each(payload, function(task) {
      ScraperTasks.register(task);
    })
  } else {
    ScraperTasks.update({
      payload: payload
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

