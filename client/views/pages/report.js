Template.report.sites = function () {
  return Site.find({'ownerId': Meteor.userId()});
  /*return [{
    status: 404, 
    userIP: '127.0.0.1',
    datetime: ISODate("2014-06-10T00:00:44.687Z"),
    page: 'http://example.com/404.html',
    referer: 'http://example.com/GoodPageWithBadLink.html'
  },{
    status: 404, 
    userIP: '127.0.0.1',
    datetime: ISODate("2014-06-10T00:00:44.687Z"),
    page: 'http://example.com/404.html',
    referer: 'http://example.com/GoodPageWithBadLink.html'
  }];*/
};