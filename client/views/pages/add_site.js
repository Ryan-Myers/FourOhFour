Template.addSite.events({
  'submit form' : function(e) {
    e.preventDefault();
    
    var site = {
      'apiKey': Random.id(),
      'ownerId': Meteor.userId(),
      'siteName': $(e.target).find('[name=siteName]').val(),
      'errors': []
    };
    
    Site.insert(site);
    
    Router.go('/instructions');
  }
});