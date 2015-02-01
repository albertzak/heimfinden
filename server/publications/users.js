Meteor.publish(null, function(_id) {
  return Meteor.users.find({});
});
