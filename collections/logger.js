Logger = new Meteor.Collection('Logger');

Logger.log = function(type, text, payload) {
  payload = JSON.stringify(payload);
  
  console.log(type, text, payload);
  Logger.insert({
    type: type,
    text: text,
    payload: payload,
    timestamp: parseInt(moment().format('X'))
  });
}
