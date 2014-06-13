/**
 * Should look like
 *  {
 *    _id: ObjectId("53964ab534e98a4b92bc218d"),
 *    apiKey: '53964aac34e98a4b92bc218c',
 *    ownerId: ObjectId("RfZGGzwLvggbArHZx"), //The user who owns this apiKey/Site.
 *    errors: [{
 *      status: 404,
 *      userIP: '127.0.0.1',
 *      datetime: ISODate("2014-06-10T00:00:44.687Z"),
 *      page: 'http://example.com/404.html',
 *    }]
 *  }
 *    
 */
Site = new Meteor.Collection('site');

//Only allow logged in users to be able to insert/update/remove from collections they own.
Site.allow({
  insert: function (userId, doc) {
    return (userId && doc.ownerId == userId);
  },
  update: function (userId, doc) {
    return (userId && doc.ownerId == userId);
  },
  remove: function (userId, doc) {
    return (userId && doc.ownerId == userId);
  },
  //Only bother fetching the ownerId since it's all we need to check for permissions.
  fetch: ['ownerId']
});

//Deny users from updating the ownerId.
Site.deny({
  update: function (userId, docs, fields, modifier) {
    return _.contains(fields, 'ownerId');
  }
});

//On server startup, if the database is empty, create a test site with an apiKey.
if (Meteor.isServer) {
  Meteor.startup(function () {
    if (Site.find().count() === 0) {
      Site.insert({
        apiKey: '53964aac34e98a4b92bc218c',
        ownerId: 'gLFf47h9rQYNG66Z5',
        errors: []
      });
    }
  });
}