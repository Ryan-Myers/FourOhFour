Template.addSite.events({
  'submit form' : function(e) {
    e.preventDefault();
    
    var site = {
      apiKey: '',
      ownerId: '',
      siteName: $(e.target).find('[name=siteName]').val(),
      errors: []
    };
    
    Site.insert(site);
  }
});