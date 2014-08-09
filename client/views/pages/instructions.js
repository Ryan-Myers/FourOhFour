Template.instructions.sites = function () {
  return Site.find({'ownerId': Meteor.userId()});
};