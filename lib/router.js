Router.configure({});

Router.map(function() {
  this.route('api404', {
    'where': 'server',
    'path': '/api/404',
    
    'action': function () {
      try {
        // Throw out non-POST data.
        if (this.request.method !== 'POST') 
          throw ({'error' : 405, 'reason' : 'This page only supports POST data.'});
        
        // Data from a POST request
        var requestData = this.request.body;
        
        // Throw out missing and invalid apiKey requests.
        if (typeof requestData.apiKey === 'undefined') 
          throw ({'error' : 401, 'reason' : 'You did not provide an apiKey.'});
        
        // Attempt to find the Site apiKey.
        var site = Site.findOne({'apiKey': requestData.apiKey});
        
        // Throw out invalid apiKey's
        if (!site) 
          throw ({'error' : 401, 'reason' : 'You did not provide a valid apiKey.'});
        
        //Build the error report from the user.
        try {        
          var errorReport = {
              status: requestData.status,
              userIP: this.request.connection.remoteAddress,
              datetime: new Date(),
              page: requestData.page
          };
          
          Site.update({'apiKey': requestData.apiKey}, {$push: {'errors': errorReport}});
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
  });
});