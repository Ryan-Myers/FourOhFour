Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  waitOn: function() { return Meteor.subscribe('site'); }
});

Router.map(function() {
  this.route('homepage', {'path': '/'});
  this.route('addSite');
  this.route('instructions');
  this.route('report', {
    'path': '/report/:apiKey',
    'notFoundTemplate': 'reportNotFound',
    'waitOn': function() { return Meteor.subscribe('errorList', {'apiKey': this.params.apiKey}); },
    'data': function() { return ErrorList.find({ 'apiKey': this.params.apiKey }); }
  });
  
  this.route('api404', {
    'where': 'server',
    'path': '/api/404',
    'action': api404
  });
  
  //Handle local 404's (makes testing easier)
  this.route('notFound', {
    'where': 'server',
    'path': '*',
    'action': function () {
      this.response.writeHead(404, {'Content-Type': 'text/html; charset=utf-8'});
      this.response.end('<!DOCTYPE html><html lang="en"><head>'+
        '<meta http-equiv="Content-Type" content="text/html; charset=utf-8">' +
        '<title>FourOhFour</title>' + 
        //TODO: Make this less hard-coded (and ugly).
        '<script id="FourOhFour" src="http://192.168.1.103:3000/scripts/404.js?apiKey=KPzvsXvcfN4FuxXkj"></script> ' +
        '</head><body>' + 
        '404 on server!' +
        '</body></html>');
    }
  });
});

var requireLogin = function(pause) {
  if (! Meteor.user()) {
    if (Meteor.loggingIn()) {
      this.render(this.loadingTemplate);
    }
    else {
      this.render('accessDenied');
    }
    pause();
  } 
};

Router.onBeforeAction('loading');
Router.onBeforeAction(requireLogin, {only: ['addSite', 'instructions', 'report']});

/**
 * 404 API - Accepts a POST from external sites with details of a 404 error that has occurred.
 * This will log the each 404 into the Sites collection by apiKey.
 * Must include a valid apiKey.
 * Returns a copy of the error report for end user logging/debugging.
 */
function api404 () {
  try {
    // Throw out non-POST data.
    if (this.request.method !== 'POST') 
      throw ({'error' : 405, 'reason' : 'This page only supports POST data.'});
    
    // Data from a POST request
    var requestData = this.request.body;
    
    // Throw out missing and invalid apiKey requests.
    if (typeof requestData.apiKey === 'undefined') 
      throw ({'error' : 401, 'reason' : 'You did not provide an apiKey.'});
    
    // Attempt to find the Site by apiKey.
    var site = Site.findOne({'apiKey': requestData.apiKey});
    
    // Throw out invalid apiKey's
    if (!site) 
      throw ({'error' : 401, 'reason' : 'You did not provide a valid apiKey.'});
    
    //Build the error report from the user.
    try {
      var errorReport = {
        apiKey:     requestData.apiKey,
        ownerId:    site.ownerId,
        siteName:   site.siteName,
        status:     requestData.status,
        userIP:     this.request.connection.remoteAddress,
        datetime:   new Date(),
        page:       requestData.page,
        referer:    requestData.referer
      };
      
      ErrorList.insert(errorReport);
    } catch (e) {
      throw ({'error': 500, 'reason': 'Error generating report'});
    }
    
    //Return a copy of the error report.
    this.response.writeHead(200, {'Content-Type': 'application/json', "Access-Control-Allow-Origin" : "*"});
    this.response.end(JSON.stringify(errorReport));      
  } catch (e) {
    if (typeof e.error === 'undefined')
      e = {'error': 500, 'reason': 'Undefined error'};
    
    this.response.writeHead(e.error, {'Content-Type': 'application/json', "Access-Control-Allow-Origin" : "*"});
    this.response.end(JSON.stringify({"error" : e.reason}));
  }
}