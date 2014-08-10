Template.report.sites = function () {
  var 
    siteCounts = this.fetch(),
    returnable = [];
  
  for (var i in siteCounts) {
    var errors = {
      'id': i,
      'page': siteCounts[i].page,
      'count':  siteCounts[i].errorCount,
      'details': ErrorDetails.find({'apiKey': siteCounts[i].apiKey, 'page': siteCounts[i].page}).fetch()
    };
    
    returnable.push(errors);
  }
    
  return returnable;
};

Template.report.rendered = function () {
  var siteCounts = this.data.fetch(),
      xCategories = [],
      seriesData = [];
  
  for (var i in siteCounts) {
    xCategories.push(siteCounts[i].page);
    seriesData.push({
      'name': siteCounts[i].page, 
      'y': siteCounts[i].errorCount, 
      'url': '/reportDetails/' + siteCounts[i]._id
    });
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
      },
      series: {
        cursor: 'pointer',
        point: {
          events: {
            click: function () {
              location.href = this.options.url;
            }
          }
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