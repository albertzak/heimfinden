Template.listing.events({
  'click .vote': function(e) {
    e.preventDefault();
    if (!Meteor.userId())
      Meteor.loginWithFacebook({requestPermissions: Accounts.ui._options.requestPermissions.facebook});
  },

  'click .upvote.votable': function(e) {
    e.preventDefault();
    var el = $(e.target);

    Meteor.call('vote', this._id);
  },

  'click .downvote.votable': function(e) {
    e.preventDefault();
    Meteor.call('vote', this._id, true);
  }
});


Template.listing.helpers({
  upvotedClass: function() {
    var userId = Meteor.userId();
    if (userId && !_.include(this.upvoters, userId))
      return 'votable';
    else
      return 'voted';
  },

  downvotedClass: function() {
    var userId = Meteor.userId();
    if (userId && !_.include(this.downvoters, userId))
      return 'votable';
    else
      return 'voted';
  },

  agencyLabel: function() {
    return (/Privat/.test(this.agency) ? 'Privat' : 'Makler');
  },

  agencyAttr: function() {
    var provision = Math.ceil(this.price * 2);
    var deposit = Math.ceil(this.price * 3);
    var tax = Math.ceil(this.price * 36 * 0.01);

    if (/Privat/.test(this.agency)) {
      return { 
        'class': 'label label-success',
        'title': '<b>Keine Maklerprovision! :)</b> <br>' +
                 '€' + deposit + ' Kaution <br>' +
                 '€' + tax + '&nbsp;&nbsp;Vergebührung',
        'data-toggle':    'tooltip',
        'data-placement': 'left',
        'data-html': true
      };
    } else {
      return {
        'class': 'label label-default',
        'title': '<b>€' + provision + ' Maklerprovision :(</b> <br>' +
                 '€' + deposit + ' Kaution <br>' +
                 '€' + tax  + '&nbsp;&nbsp;Vergebührung <br><br>' +
                 this.agency,
        'data-toggle':    'tooltip',
        'data-placement': 'left',
        'data-html': true
      };
    }
  }
});

Template.listing.rendered = function() {
  $('[data-toggle="tooltip"]').tooltip();
};
