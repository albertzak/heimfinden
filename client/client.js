Deps.autorun(function() {
  if (Meteor.user() && typeof FbFriends === 'undefined') {
    FbFriends = FacebookCollections.getFriends('me', ['id', 'name'], 5000); 
  }
});

Deps.autorun(function() {
  if (Meteor.user() && FbFriends) {
    Meteor.call('cacheFbFriends', FbFriends.find({}).fetch());
  }
});

Deps.autorun(function(){
  var count  = Counts.get('nextListingsCount');
  count = (count > 0) ? '(' + count + ') ' : '';
  document.title = count + 'Heimfinden²';
});

UI.registerHelper('pagination', function(context, options) {
   return Pagination.links(
    Router.current().route.path(),
    Listings.find(Listings.defaultSelector()).count(), {
      currentPage: Session.get('page'),
      perPage: 4
    });
});

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

UI.registerHelper('linebreaks', function(context, options) {
  if(context)
    return context.split('\n').join('<br>');
  else
    return '';
});


UI.registerHelper('activeClass', function(context, options) {
  if(context === Router.current().route.path())
    return {class: 'active'};
});

UI.registerHelper('showCount', function(context, options) {
  var counts = Counts.get(context);

  if (counts > 0)
    return counts;
  else
    return false;
});

UI.registerHelper('randomGreeting', function(context, options) {
  var greeting = ['Hi', 'Hiya', 'Yo', 'Hallo', 'Hey', 'Yooo', 'Hej'][moment().weekday()];
  if(context && context.services && context.services.facebook && context.services.facebook.first_name)
    return [greeting, context.services.facebook.first_name].join(', ');
  else
    return greeting + '!';
});

UI.registerHelper('profilePicture', function(context, options) {
  if(context && context.services && context.services.facebook && context.services.facebook.id) {
    return 'http://graph.facebook.com/'
            + context.services.facebook.id
            + "/picture/?width=100&height=100";
  }
});

UI.registerHelper('name', function(context, options) {
  if(context && context.profile && context.profile.name) {
    return context.profile.name;
  }
});

UI.registerHelper('users', function(context, options) {
  return _.reject(_.map(context, function(id) {
    if (id != Meteor.userId())
      if (user = Meteor.users.findOne(id))
        return user;
  }), function(e) { return (typeof e === 'undefined'); });
});

Template.navSecondary.events({
  'click .login-link': function() {
    Meteor.loginWithFacebook({requestPermissions: Accounts.ui._options.requestPermissions.facebook});
  }
});

Template.loginModal.events({
  'click .login-button': function() {
    Meteor.loginWithFacebook({requestPermissions: Accounts.ui._options.requestPermissions.facebook});
  }
});

Template.navSecondary.events({
  'click .logout-link': Meteor.logout
});

Deps.autorun(function () {
  var current = Router.current();

  Deps.afterFlush(function () {
    $('.content-inner').scrollTop(0);
    $(window).scrollTop(0);
  });
});
