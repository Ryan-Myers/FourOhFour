Meteor.publish('site', function() {
  return Site.find({ownerId: this.userId});
});