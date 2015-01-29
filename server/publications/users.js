Meteor.publish(null, function() {
  return Meteor.users.find({_id: this.userId}, {fields: [
    {'services.facebook.id': 1},
    {'services.facebook.first_name': 1},
  ]});
});
