Status = new Meteor.Collection('status');

Status.log = function(text) {
  Status.insert({
    timestamp: moment().format('X'),
    text: text
  });
}
