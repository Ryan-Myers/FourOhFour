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

//On server startup, if the database is empty, create a test site with an apiKey.
if (Meteor.isServer) {
  Meteor.startup(function () {
    if (Site.find().count() === 0) {
      Site.insert({
        apiKey: '53964aac34e98a4b92bc218c',
        errors: []
      });
    }
  });
}