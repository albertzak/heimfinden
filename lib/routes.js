Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  waitOn: function() {
    return Meteor.subscribe('counts', Listings.defaultSelector());
  }
});

Router.onBeforeAction(function () {
  if (!Meteor.user() && Meteor.isClient) {
    $('#loginModal').modal('show');
  }

  this.next();
});

Router.map(function() {
  this.route('nextListings', {
    path: '/',
    template: 'listings',
    waitOn: function() {
      return Pages = Meteor.subscribe('nextListings');
    },
    data: function() {
      return {
        listings: Listings.find(Listings.defaultSelector(), { limit: 2 })
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
        listings: Listings.find(Listings.defaultSelector(), { limit: 7 })
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
        listings: Listings.find(Listings.defaultSelector(), { limit: 7 })
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
    path: '/friends',
    template: 'listings',
    waitOn: function() {
      return Meteor.subscribe('friendsListings');
    },
    data: function() {
      return {
        listings: Listings.find(Listings.defaultSelector(), { limit: 7 })
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

});
