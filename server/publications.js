Meteor.publish('api', function() {
  return API.find();
});