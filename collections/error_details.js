/**
 * Should look like
 *  {
 *    _id: ObjectId("53964ab534e98a4b92bc218d"),
 *    apiKey: '53964aac34e98a4b92bc218c',
 *    ownerId: ObjectId("RfZGGzwLvggbArHZx"), //The user who owns this apiKey/Site.
 *    siteName: 'test.com',
 *    status: 404,
 *    userIP: '127.0.0.1',
 *    datetime: ISODate("2014-06-10T00:00:44.687Z"),
 *    page: 'http://example.com/404.html',
 *    referer: 'http://example.com/GoodPageWithBadLink.html'
 *  }
 *    
 */
ErrorDetails = new Meteor.Collection('errorDetails');

ErrorDetails.allow({
  insert: function (userId, doc) {
    return true; //Allow everyone to insert an error for a particular apiKey
  },
  update: function (userId, doc) {
    return false; //Never allow updating an error.
  },
  remove: function (userId, doc) {
    return (userId && doc.ownerId == userId); //Only allow the owner to remove a particular error.
  },
  //Only bother fetching the ownerId since it's all we need to check for permissions.
  fetch: ['ownerId']
});

//Deny users from updating the ownerId.
ErrorDetails.deny({
  update: function (userId, docs, fields, modifier) {
    return _.contains(fields, 'ownerId');
  }
});