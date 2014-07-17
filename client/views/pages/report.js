Template.report.sites = function () {
  var 
    siteCounts = Session.get("siteCounts"),
    errorDetails = Site.find({'ownerId': Meteor.userId()}),
    returnable = [];
  
  for (var i in siteCounts) {
    var errors = {
      'id': i,
      'page': siteCounts[i]._id,
      'count':  siteCounts[i].count,
      'details': []
    };
    
    //Add all of the meta data for each error to the group for the page that it matches.
    errorDetails.forEach(function (sites) {
      for (var j in sites.errors) {
        if (sites.errors[j].page == errors.page) {
          errors.details.push(sites.errors[j]);
        }
      }
    });
    
    returnable.push(errors);
  }
  
  return returnable;
};

Template.report.rendered = function () {
  var siteCounts = Session.get("siteCounts"),
      xCategories = [],
      seriesData = [];
  
  for (var i in siteCounts) {
    xCategories.push(siteCounts[i]._id);
    seriesData.push({'name': siteCounts[i]._id, 'y': siteCounts[i].count});
  }
  
  $('#report-bar-chart').highcharts({
    chart: {
      type: 'bar'
    },
    title: {
      text: '404 Errors by page'
    },
    xAxis: {
      categories: xCategories,
      title: {
        text: 'Sites'
      }
    },
    yAxis: {
      allowDecimals: false,
      min: 0,
      title: {
        text: 'Count of 404\'s',
        align: 'high'
      }
    },
    plotOptions: {
      bar: {
        dataLabels: {
          enabled: true
        }
      }
    },
    credits: {
      enabled: false
    },
    legend: {
      enabled: false
    },
    series: [{
      data: seriesData
    }]
  });
};

//TODO: This only runs once when loading, should it update in real time?
//Also, this only matches on ownerId, there should be a match on apiKey instead.
Meteor.startup(function () {
  Deps.autorun(function () {
    var pipe = [];
    pipe.push(
      {$match: {'ownerId': Meteor.userId()}},
      {$project: {'errors': 1}}, 
      {$unwind: "$errors"}, 
      {$group: {'_id': "$errors.page", 'count': {$sum: 1}}},
      {$sort: {'count': -1}}
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