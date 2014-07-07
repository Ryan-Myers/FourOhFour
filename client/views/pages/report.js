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
  //[{_id: "http://example.com/BadLink", count: 1}, {_id: "http://example.com/BadLink", count: 12}]
};

//TODO: This only runs once when loading, should it update in realtime?
//Also, this only matches on ownerId, there should be a match on apiKey instead.
Meteor.startup(function () {
  Deps.autorun(function () {
    var pipe = [];
    pipe.push(
      {$match: {ownerId: Meteor.userId()}},
      {$project: {'errors': 1}}, 
      {$unwind: "$errors"}, 
      {$group: {'_id': "$errors.page", 'count': {$sum: 1}}}
    );
    
    Site.aggregate(pipe, function (err, docs) {
      if (docs) {
        Session.set("siteCounts", docs);
      }
      
      if (err) {
        console.log("err");
        console.log(err);
      }
    });
  });
});