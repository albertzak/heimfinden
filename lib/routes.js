Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading'
});

Router.map(function() {

  this.route('votedListings', {
    path: '/gesehen',
    template: 'listings',
    waitOn: function() {
      return Meteor.subscribe('votedListings');
    },
    data: function() {
      return {
        listings: Listings.find(Listings.defaultSelector(), { limit: 10 })
      };
    }
  });

  this.route('upvotedListings', {
    path: '/ja',
    template: 'listings',
    waitOn: function() {
      return Meteor.subscribe('votedListings', 'upvoted');
    },
    data: function() {
      return {
        listings: Listings.find(Listings.defaultSelector(), { limit: 10 })
      };
    }
  });

  this.route('downvotedListings', {
    path: '/nein',
    template: 'listings',
    waitOn: function() {
      return Meteor.subscribe('votedListings', 'downvoted');
    },
    data: function() {
      return {
        listings: Listings.find(Listings.defaultSelector(), { limit: 10 })
      };
    }
  });

  this.route('nextListings', {
    path: '/',
    template: 'listings',
    waitOn: function() {
      return Meteor.subscribe('nextListings');
    },
    data: function() {
      return {
        listings: Listings.find(Listings.defaultSelector(), { limit: 2 })
      };
    }
  });

  this.route('listing', {
    path: '/listing/:_id',
    waitOn: function() {
      return Meteor.subscribe('singleListing', this.params._id); },
    data: function() {
      return Listings.findOne(this.params._id);
    }
  });

});
