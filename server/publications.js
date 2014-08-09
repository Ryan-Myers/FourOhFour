Meteor.publish('site', function() {
  return Site.find({ownerId: this.userId});
});
Meteor.publish('errorList', function() {
  return ErrorList.find({ownerId: this.userId});
});