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

Template.report.siteCounts = function () {
  return Session.get("siteCounts");
};

var pipe = [];
pipe.push(
  {$project: {'errors': 1}}, 
  {$unwind: "$errors"}, 
  {$group: {'_id': "$errors.page", 'count': {$sum: 1}}}
);
  
return Site.aggregate(pipe, function (err, docs) {
  if (docs) {
    console.log("docs");
    console.log(docs);
    Session.set("siteCounts", docs);
  }
  
  if (err) {
    console.log("err");
    console.log(err);
  }
});