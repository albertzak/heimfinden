Meteor.publish(null, function(_id) {
  return Meteor.users.find({});
});

Meteor.users.activeCount = function() {
  return Meteor.users.find({
    'status.online': true,
    'status.idle': false
  }).count();
}
