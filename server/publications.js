Meteor.publish('site', function() {
  return Site.find({ownerId: this.userId});
});
Meteor.publish('error', function() {
  return Error.find({ownerId: this.userId});
});