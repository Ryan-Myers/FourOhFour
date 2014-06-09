Meteor.publish('site', function() {
  return Site.find();
});