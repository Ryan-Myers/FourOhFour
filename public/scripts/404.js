function is404(fCallback) {
  var req = new XMLHttpRequest();
  console.log(location.href);
  req.open('HEAD', location.href, true);
  req.onreadystatechange  = function() {
    if (this.readyState == this.DONE) {
      fCallback(this.status != 404);
    }
  };
  
  req.send();
}

is404(function(bStatus) {
  if (bStatus) {
    alert('Not a 404!');
  }
  else {
    var params = 'id=12345&page=ryanmyers.ca';
    var post = new XMLHttpRequest();
    post.open('POST', 'http://192.168.1.103:3000/api/404', false);
    post.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    post.setRequestHeader("Content-length", params.length); 
    post.send(params);
    
    console.log(JSON.parse(post.responseText));
  }
});