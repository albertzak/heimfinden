Meteor.startup(function() {
  Session.setDefault('filter-pricem2', 12);
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
})

Template.filterButton.rendered = function() {
  // $('a.filter').popover({
  //   html: true, 
  //   content: function() {
  //     return window.filterContent;
  //   }
  // });

  // $('a.filter').on('shown.bs.popover', function () {

    // Price/m2 slider filter
    $('.filter-pricem2').noUiSlider({
      start: Session.get('filter-pricem2'),
      step: 1,
      range: {
        'min': 7,
        'max': 25
      }
    }).on({
      slide: function() {
        Session.set('filter-pricem2', parseInt($('.filter-pricem2').val()));
      }
    });

    // PLZ toggle filter
    $('.plz.toggle').click(function(e) {
      el  = $(e.target);
      plz = el.data('plz');
      plzs = Session.get('filter-plz');

      Util.toggle(plzs, plz);

      Session.set('filter-plz', plzs);
    })


  // });

};

Template.filterPanel.helpers({
  filterPricem2: function() {
    return Session.get('filter-pricem2');
  },

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
  }
});
