var firebaseDB = new Firebase('https://devent-vo.firebaseIO.com/');

// Models etc
var User = Backbone.Model.extend({
  
});

var Users = Backbone.Firebase.Collection.extend({
  /*initialize: function(models, options) {
    that = this;
    this.on('add', function(){console.log(that)});
  },*/
  model: User,
  firebase: 'https://devent-vo.firebaseIO.com/users'
});

var Event = Backbone.Model.extend({
});

var Events = Backbone.Firebase.Collection.extend({
  model: Event,
  firebase: 'https://devent-vo.firebaseIO.com/events'
});

var EventView = Backbone.View.extend({
  tagName: "li",

  //template: _.template($("#events-template").html()),
  template: _.template(
    "Name of event: <%= name %><br/>"
    + "Date of event (yyyy/mm/dd): <%= year %>/<%= month %>/<%= day %><br/>"
    + "Owner of event: <%= owner %>"
  ),

  initialize: function() {
    this.listenTo(this.model, 'change', this.render);
    this.listenTo(this.model, 'destroy', this.remove);
  },
  
  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  },
  
  clear: function() {
    this.model.destroy();
  }
  
});

var EventsView = Backbone.View.extend({
  el: $("#events"),
  /*events: {
    "click #new-event-create": 'createOnPress'
  },*/
  initialize: function() {
    that = this;
    that.main = $("#main");

    that.name = $("#new-event-name");
    that.time = $("#new-event-time");
    that.day = $("#new-event-day");
    that.month = $("#new-event-month");
    that.year = $("#new-event-year");
    that.button = $("#new-event-create");
    that.loc = $("#new-event-loc");
    that.state = $("#new-event-state");

    that.listenTo(myEvents, 'add', this.addOne);
    that.listenTo(myEvents, 'reset', this.addAll);
    that.listenTo(myEvents, 'all', this.render);
  },
  
  render: function() {
    if(myEvents.length) {
      this.main.show();
    } else {
      this.main.hide();
    }
  },

  addOne: function(ev) {
    var view = new EventView({model: ev});
    this.$("event-list").append(view.render().el);
  },

  addAll: function() {
    Events.each(this.addOne, this);
  },

  createOnPress: function() {
    var em = getUserLoggedIn().get('email');
    if(em == undefined)
      alert("You must be logged in to create an event");
    else if(!this.name.val() || !this.time.val() || !this.day.val()
      || !this.month.val() || !this.year.val() || !this.loc.val()
      || !this.state.val())
      alert("Please enter all data");
    else {
      alert("Created event");
      var search_results;
      /*function geocode() {
        var coder = new intel.maps.Geocoder();
        coder.geocode({'address': this.loc.val(), 'region': this.region.val()},
          search_results);
        console.log(search_results);
      }
      geocode();*/
      myEvents.add({
        name: this.name.val(),
        time: this.time.val(),
        day: this.day.val(),
        month: this.month.val(),
        year: this.year.val(),
        owner: em
      });
    
      this.name.val('');
      this.time.val('');
      this.day.val('');
      this.month.val('');
      this.year.val('');
      this.loc.val('');
      this.state.val('');
    }
  }
});

var myUsers;// = new Users;
var currentUser;// = new User;
var myEvents;// = new Events();
var myEventsView;// = new EventsView();

var getUserLoggedIn = function() {
  if(currentUser.get('email') != undefined) {
    return currentUser;
  } else {
    return new User();
  }
}

var checkUserLoggedIn = function() {
  intel.user.getDetails(
    function(userDetails) {
      intel.profile.getUserProfile(
        function(userProfile) {
          setUserLoggedIn(new User({
            email: userDetails.emails[0],
            firstName: userProfile.basic.firstName,
            lastName: userProfile.basic.lastName
          }));
        },
        function(err) {
          console.log(err);
          logout(true)
        })
    },
    function(err) {
      logout(true)
    }
  );
}

var setUserLoggedIn = function(user) {
  currentUser.set(user.attributes);
}

var setUserLoggedOut = function() {
  //if(currentUser) currentUser.clear();
  currentUser = new User();
}

var sendMail = function(to, subject, text) {
  $.ajax({
    type: 'POST',
    dataType: 'json',
    url: 'mail',
    data: {
      to: to,
      subject: subject,
      text: text
    },
    success: function(msg) {
      console.log("success handler");
      console.log(msg);
    },
    error:function (xhr, ajaxOptions, thrownError){
      console.log(xhr.status);
      console.log(thrownError);
    } 
  });
}


// Login functions
var errorCallback = function(err) {
  console.log(err);
}

var getUserDetailsSuccessCallback = function(userDetails) {
  var eadr = userDetails.emails[0];
  var repeat = myUsers.where({email: eadr});

  if(repeat.length > 0) {
    //alert("omg repeat"); // Have now logged in a user?
    setUserLoggedIn(repeat[0]);
  } else {
    intel.profile.getUserProfile(function(profile) {
        setUserLoggedIn(myUsers.add({
          firstName: profile.basic.firstName,
          lastName: profile.basic.lastName,
          email: eadr
        }));
      },
      errorCallback
    );
  }
  //console.log(myUsers);
}

var loginSuccessCallback = function(data) {
  intel.user.getDetails(getUserDetailsSuccessCallback, errorCallback);
}

var initSuccessCallback = function(data) {
  intel.auth.login({
      redirectUri: 'http://localhost/authredirect.html',
      specs: "location=1,status=1,scrollbar=1,width=700,height=400"
    },
    loginSuccessCallback,
    errorCallback
  );
  /*var location = new intel.maps.Location();
  location.login({
     client_id: 'ca0d219c6090696396f1b2ab4718e18e', 
     secret_id: 'ae7163fddba0bc48'
  }, function(){});*/

}

var login = function() {
  intel.auth.getAuthStatus(
    function(token) {
      console.log(token);
      if(token.access_token.authentication_type === 0) {
        initSuccessCallback();
      } else if(token.access_token.authentication_type === 
                "user_authorization") {
        var em = getUserLoggedIn().get('email');
        alert("You are logged in as " + em);
      } else {
        console.log("oops, is broke");
        console.log(token);
      }
    },
    function(err) {
      intel.auth.init({
          clientId: 'ca0d219c6090696396f1b2ab4718e18e',
          secretId: 'ae7163fddba0bc48',
          scope: 'user:details user:scope profile:full'
        },
        initSuccessCallback, 
        errorCallback
      );
    }
  );
}

var logout = function(bool) {
  intel.auth.logout(
    function() {
      if(!bool) alert("Now logged out");
      setUserLoggedOut();
    },
    errorCallback
  );
}


// Run on load
checkUserLoggedIn();

function createEvent() {
  //myEventsView.createOnPress();
  $("#new-event-create").click(function(e) {
    //console.log("hey");
    myEventsView.createOnPress();
  });
}
$(document).ready(function() {

  // State
  myUsers = new Users;
  currentUser = new User;
  myEvents = new Events();
  myEventsView = new EventsView();

  createEvent();
});
