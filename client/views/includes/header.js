Template.header.sites = function () {
  return Site.find({'ownerId': Meteor.userId()});
};