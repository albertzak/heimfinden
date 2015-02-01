Meteor.startup(function() {

  Session.setDefault('filter-plz', _.reduce(Sanitize.limits.plz, function(obj, plz) {
    obj[plz] = 1;
    return obj;
  }, {}));

  Session.setDefault('filter-pricem2', Sanitize.limits.maxPricem2);

  Session.setDefault('filter-priceUpper', Sanitize.limits.maxPrice);
  Session.setDefault('filter-priceLower', Sanitize.limits.minPrice);

  Session.set('filter-m2Upper', Sanitize.limits.maxm2);
  Session.set('filter-m2Lower', Sanitize.limits.minm2);
})

Template.filterPanel.rendered = function() {
    $('.filter-panel').scrollupbar();

    // PLZ toggle filter
    $('.plz.toggle').click(function(e) {
      el  = $(e.target);
      plz = el.data('plz');
      plzs = Session.get('filter-plz');

      Util.toggle(plzs, plz);

      Session.set('filter-plz', plzs);
    });

    // Price slider filter
    $('.filter-price').noUiSlider({
      start: [
        Session.get('filter-priceLower'),
        Session.get('filter-priceUpper')],
      step: 10,
      connect: true,
      margin: 100,
      range: {
        'min': Sanitize.limits.minPrice,
        'max': Sanitize.limits.maxPrice
      }
    }).on({
      slide: function() {
        Session.set('filter-priceUpper', parseInt($('.filter-price').val()[1]));
        Session.set('filter-priceLower', parseInt($('.filter-price').val()[0]));
      }
    });


    // Price/m2 slider filter
    $('.filter-pricem2').noUiSlider({
      start: Session.get('filter-pricem2'),
      step: 1,
      connect: 'lower',
      range: {
        'min': Sanitize.limits.minPricem2,
        'max': Sanitize.limits.maxPricem2
      }
    }).on({
      slide: function() {
        Session.set('filter-pricem2', parseInt($('.filter-pricem2').val()));
      }
    });

    // m2 slider filter
    $('.filter-m2').noUiSlider({
      start: [
        Session.get('filter-m2Lower'),
        Session.get('filter-m2Upper')],
      step: 10,
      connect: true,
      margin: 10,
      range: {
        'min': Sanitize.limits.minm2,
        'max': Sanitize.limits.maxm2
      }
    }).on({
      slide: function() {
        Session.set('filter-m2Upper', parseInt($('.filter-m2').val()[1]));
        Session.set('filter-m2Lower', parseInt($('.filter-m2').val()[0]));
      }
    });
};

Template.filterPanel.helpers({
  plz: function() {
    return Sanitize.limits.plz;
  },

  plzAttr: function(plz) {
    plzActive = Session.get('filter-plz') && Session.get('filter-plz')[plz];

    activeClass = plzActive ? 
      'label-success' : 'label-default';

    return { 
      'class':    'label plz toggle ' + activeClass,
      'data-plz': plz,
    };
  },

  filterPriceUpper: function() {
    return Session.get('filter-priceUpper');
  },

  filterPriceLower: function() {
    return Session.get('filter-priceLower');
  },

  filterPricem2: function() {
    return Session.get('filter-pricem2');
  },

  filterm2Upper: function() {
    return Session.get('filter-m2Upper');
  },

  filterm2Lower: function() {
    return Session.get('filter-m2Lower');
  },


});
