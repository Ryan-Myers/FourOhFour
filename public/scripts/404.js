(function(){
  /*
     Provide the XMLHttpRequest constructor for Internet Explorer 5.x-6.x:
     Other browsers (including Internet Explorer 7.x-9.x) do not redefine
     XMLHttpRequest if it already exists.
   
     This example is based on findings at:
     http://blogs.msdn.com/xmlteam/archive/2006/10/23/using-the-right-version-of-msxml-in-internet-explorer.aspx
  */
  if (typeof XMLHttpRequest === "undefined") {
    XMLHttpRequest = function () {
      try { return new ActiveXObject("Msxml2.XMLHTTP.6.0"); }
      catch (e) {}
      try { return new ActiveXObject("Msxml2.XMLHTTP.3.0"); }
      catch (e) {}
      try { return new ActiveXObject("Microsoft.XMLHTTP"); }
      catch (e) {}
      throw new Error("This browser does not support XMLHttpRequest.");
    };
  }
  
  /**
   * Returns true to the callback function if the URL returns a 404 status.
   * @param url
   * @param fCallback
   */
  function is404(url, fCallback) {
    var req = new XMLHttpRequest();
    req.open('HEAD', url, true);
    
    req.onreadystatechange = function() {
      if (this.readyState == this.DONE) {
        fCallback(this.status == 404);
      }
    };
    
    req.send();
  }
  
  /**
   * Called when is404 returns the request. If the page is 404, then send the current page and API key to the server for logging.
   * @param bIs404
   */
  is404(location.href, function(bIs404) {
    if (bIs404) {
      var scriptSrc = document.getElementById('FourOhFour').src,
          apiKey = scriptSrc.substring(scriptSrc.indexOf('?')+ 1),
          a = document.createElement('a');
          a.href = scriptSrc;
      var postURL = a.protocol + '//' + a.host + '/api/404',
          params = apiKey + '&page=' + location.href + '&status=404';
      
      var post = new XMLHttpRequest();
      post.open('POST', postURL, true);
      post.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
      post.setRequestHeader("Content-length", params.length); 
      
      post.onreadystatechange = function() {
        if (this.readyState == this.DONE) {
          console.log(JSON.parse(post.responseText));
        }
      };
      post.send(params);
    }
  });
})();