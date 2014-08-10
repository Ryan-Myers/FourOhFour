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
    'waitOn': function() { return Meteor.subscribe('errorGroup', {'apiKey': this.params.apiKey}); },
    'data': function() { return ErrorGroup.find({ 'apiKey': this.params.apiKey }, {'sort': [['errorCount', 'desc']], 'limit': 20}); }
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
      //TODO: Make this less hard-coded (and ugly).
      this.response.end('<!DOCTYPE html><html lang="en"><head>'+
        '<meta http-equiv="Content-Type" content="text/html; charset=utf-8">' +
        '<title>FourOhFour</title>' + 
        '<script id="FourOhFour" src="http://ryanmyers.ca:3000/scripts/404.js?apiKey=EgYMrxyZFHt2zKTF2"></script>  ' +
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

Router.onBeforeAction('loading', {'only': ['report']});
Router.onBeforeAction(requireLogin, {'only': ['addSite', 'instructions', 'report']});

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
      var errorDetail = {
        'apiKey':     requestData.apiKey,
        'ownerId':    site.ownerId,
        'siteName':   site.siteName,
        'status':     requestData.status,
        'userIP':     this.request.connection.remoteAddress,
        'datetime':   new Date(),
        'page':       requestData.page,
        'referer':    requestData.referer
      };
      
      ErrorDetails.insert(errorDetail);
      
      var groupData = {
        'apiKey': requestData.apiKey, 
        'page'  : requestData.page, 
        'status': requestData.status
      };
      
      var groupCheck = ErrorGroup.findOne(groupData);
      
      if (!groupCheck) {
        groupData.errorCount = 1;
        groupData.ownerId = site.ownerId;
        
        ErrorGroup.insert(groupData);
      } else {
        ErrorGroup.update(groupData, {$inc: {'errorCount': 1}});
      }
      
    } catch (e) {
      throw ({'error': 500, 'reason': 'Error inserting data.'});
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