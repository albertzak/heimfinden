Meteor.startup(function() {
  moment.locale('de', {
    relativeTime : {
      future: "in %s",
      past:   "vor %s",
      s:  "5 Sekunden",
      m:  "einer Minute",
      mm: "%d Minuten",
      h:  "einer Stunde",
      hh: "%d Stunden",
      d:  "einem Tag",
      dd: "%d Tagen",
      M:  "einem Monat",
      MM: "%d Monaten",
      y:  "einem Jahr",
      yy: "%d Jahren"
    }
  });
});

Template.listings.helpers({
  listings: function () {
    return Listings.find({
      plz:     {$in: Util.objectToArray(Session.get('filter-plz'))},
      price:   {$lt: Session.get('filter-priceUpper'), $gt: Session.get('filter-priceLower')},
      pricem2: {$lt: Session.get('filter-pricem2')},
      m2:      {$lt: Session.get('filter-m2Upper'), $gt: Session.get('filter-m2Lower')}    
    },{
      sort: {sourceTimestamp: -1},
      limit: 10
    });
  }
});

Template.listing.helpers({
  agencyLabel: function() {
    return (this.agency === 'Privat' ? 'Privat' : 'Makler');
  },

  agencyAttr: function() {
    var provision = Math.ceil(this.price * 2);
    var deposit = Math.ceil(this.price * 3);
    var tax = Math.ceil(this.price * 36 * 0.01);

    if (this.agency === 'Privat') {
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
})

UI.registerHelper('simpleHumanTime', function(context, options) {
  if(context)
    return moment(context, 'X').format('DD.MM.YYYY HH:mm');
  else
    return '';
});

UI.registerHelper('humanTime', function(context, options) {
  if(context)
    return moment(context, 'X').format('[um] HH:mm [Uhr, am] DD.MM.YYYY');
  else
    return '';
});

UI.registerHelper('isoTime', function(context, options) {
  if(context)
    return moment(context, 'X').toISOString();
  else
    return '';
});

Template.listing.rendered = function() {
  $('[data-toggle="tooltip"]').tooltip();
};
