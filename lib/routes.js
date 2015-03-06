Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  waitOn: function() {
    return Meteor.subscribe('counts', Listings.defaultSelector());
  }
});

Router.onBeforeAction(function() {
  if (!Meteor.user() && Meteor.isClient) {
    $('#loginModal').modal('show');
  }

  Session.set('page', parseInt(this.params.page) || 1);

  this.next();
});

Router.map(function() {
  this.route('upvotedListings', {
    path: '/ja/:page?',
    template: 'listings',
    waitOn: function() {
      return Meteor.subscribe('votedListings', 'upvoted');
    },
    data: function() {
      return {
        listings: Pagination.collection(Listings.find(Listings.defaultSelector()).fetch())
      };
    }
  });

  this.route('downvotedListings', {
    path: '/nein/:page?',
    template: 'listings',
    waitOn: function() {
      return Meteor.subscribe('votedListings', 'downvoted');
    },
    data: function() {
      return {
        listings: Pagination.collection(Listings.find(Listings.defaultSelector()).fetch())
      };
    }
  });

  this.route('listing', {
    path: '/listing/:_id',
    waitOn: function() {
      return Meteor.subscribe('singleListing', this.params._id);
    },
    data: function() {
      return Listings.findOne(this.params._id);
    }
  });

  this.route('friends', {
    path: '/friends/:page?',
    template: 'listings',
    waitOn: function() {
      return Meteor.subscribe('friendsListings');
    },
    data: function() {
      return {
        listings: Pagination.collection(Listings.find(Listings.defaultSelector()).fetch())
      };
    }
  });

  this.route('scraper', {
    path: '/scraper',
    waitOn: function() {
      return Meteor.subscribe('scraperStatus')
        && Meteor.subscribe('logger');
    },
    data: function() {
      return {
        scraperStatus: ScraperStatus.findOne({}),
        logs: Logger.find({})
      };
    }
  });

  // Last route because of page wildcard
  this.route('nextListings', {
    path: '/:page?',
    template: 'listings',
    waitOn: function() {
      return Meteor.subscribe('nextListings');
    },
    data: function() {
      return {
        listings: Pagination.collection(Listings.find(Listings.defaultSelector()).fetch(), {
          reactive: false
        })
      };
    }
  });

});
