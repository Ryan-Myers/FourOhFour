Router.configure({});

Router.map(function() {
  this.route('clientJson', {
    where: 'server',
    path: '/api/404',
    
    action: function () {
      // GET, POST, PUT, DELETE
      var requestMethod = this.request.method;
      // Data from a POST request
      var requestData = this.request.body;
      
      this.response.writeHead(200, {'Content-Type': 'application/json', "Access-Control-Allow-Origin" : "*"});
      this.response.end(JSON.stringify({"requestMethod" : requestMethod, "requestData" : requestData}));
    }
  });
});