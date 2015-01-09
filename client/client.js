moment.locale('de', {
    relativeTime : {
        future: "in %s",
        past:   "vor %s",
        s:  "sekungen",
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
    if (this.agency === 'Privat') {
      return { class: 'label label-success' };
    } else {
      return { class: 'label label-default' };
    }
  }
})

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

Template.refreshButton.events({
  'click button': function () {
    Meteor.call('scrape', function (error, result) {
      if (error) {
        console.log(error);
        throw new Meteor.Error(500, error);
      }
    });
  }
});
