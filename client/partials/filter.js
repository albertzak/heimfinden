// Meteor.startup(function() {
//   el = $('#filter-content');
//   if(el[0]) {
//      window.filterContent = el.html();
//      el.remove();
//   }
// })

Template.filter.rendered = function() {
  // $('a.filter').popover({
  //   html: true, 
  //   content: function() {
  //     return window.filterContent;
  //   }
  // });

  // $('a.filter').on('shown.bs.popover', function () {

    $('.filter-pricem2').noUiSlider({
      start: 12,
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


  // });

};

Template.filter.helpers({
  filterPricem2: function() {
    return Session.get('filter-pricem2');
  }
});
