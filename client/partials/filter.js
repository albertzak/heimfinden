Meteor.startup(function() {
  Session.setDefault('filter-plz', {
    1010: 1,
    1030: 1,
    1040: 0,
    1060: 1,
    1070: 1,
    1080: 0,
    1090: 1,
    1170: 1,
    1180: 1,
    1190: 1
  });

  Session.setDefault('filter-pricem2', 12);

  Session.setDefault('filter-priceUpper', 1700);
  Session.setDefault('filter-priceLower', 100);
})

Template.filterButton.rendered = function() {
  // $('a.filter').popover({
  //   html: true, 
  //   content: function() {
  //     return window.filterContent;
  //   }
  // });

  // $('a.filter').on('shown.bs.popover', function () {

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
        'min': 200,
        'max': 1700
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
        'min': 7,
        'max': 25
      }
    }).on({
      slide: function() {
        Session.set('filter-pricem2', parseInt($('.filter-pricem2').val()));
      }
    });

  // });

};

Template.filterPanel.helpers({
  plz: function() {
    return [1010, 1030, 1040, 1060, 1070, 1080, 1090, 1170, 1180, 1190];
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
  }

});
