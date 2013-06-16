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

// State
var myUsers = new Users;
var currentUser = new User;

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
          setUserLoggedOut();
        })
    },
    function(err) {
      setUserLoggedOut();
    }
  );
}

var setUserLoggedIn = function(user) {
  currentUser.set(user.attributes);
}

var setUserLoggedOut = function() {
  currentUser.clear();
}

/*var getIsUserAuthd = function() {
  var r;
  intel.auth.getAuthStatus(
    function(token) {
      r = token.access_token.authentication_type === "user_authorization";
    },
    function(err) {
      r = false;
    }
  );

  return r;
}*/



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
}

var login = function() {
  intel.auth.getAuthStatus(
    function(token) {
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

var logout = function() {
  intel.auth.logout(
    function() {
      alert("Now logged out");
      setUserLoggedOut();
    },
    errorCallback
  );
}


// Run on load
checkUserLoggedIn();
