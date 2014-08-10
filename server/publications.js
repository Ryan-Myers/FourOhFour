Meteor.publish('site', function() {
  return Site.find({ownerId: this.userId});
});
Meteor.publish('errorDetails', function() {
  return ErrorDetails.find({ownerId: this.userId});
});
Meteor.publish('errorGroup', function() {
  return ErrorGroup.find({ownerId: this.userId});
});