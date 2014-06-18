Template.addSite.events({
  'submit form' : function(e) {
    e.preventDefault();
    
    var siteName = $(e.target).find('[name=siteName]').val();
    
    var site = {
      'apiKey': Random.id(),
      'ownerId': Meteor.userId(),
      'siteName': siteName,
      'errors': []
    };
    
    Site.insert(site);
    
    Router.go('/instructions');
  }
});