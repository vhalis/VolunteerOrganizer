var firebaseDB = new Firebase('https://devent-vo.firebaseIO.com/');

// Models etc
var User = Backbone.Model.extend({
  
});

var Users = Backbone.Firebase.Collection.extend({
  model: User,
  firebase: 'https://devent-vo.firebaseIO.com/users'
});

// State


// Instances
myUsers = new Users;

var logit = function(data) {
  console.log("Logging");
  console.log(data);
}

var errorCallback = function(err) {
  console.log(err);
}

var getUserDetailsSuccessCallback = function(userDetails) {
  var eadr = userDetails.emails[0];
  var repeat = myUsers.where({email: eadr});
  if(repeat.length > 0) {
    alert("omg repeat"); // Have now logged in a user?
  } else {
    intel.profile.getUserProfile(function(profile) {
        myUsers.add({
          firstName: profile.basic.firstName,
          lastName: profile.basic.lastName,
          email: eadr
        });
      },
      errorCallback
    );
  }
  console.log(myUsers);
}

var loginSuccessCallback = function(data) {
//  intel.profile.getUserProfile (getUserProfileSuccessCallback, errorCallback);
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
  intel.auth.init({
      clientId: 'ca0d219c6090696396f1b2ab4718e18e',
      secretId: 'ae7163fddba0bc48',
      scope: 'user:details user:scope profile:full'
    },
    initSuccessCallback, 
    errorCallback
  );
}

var logout = intel.auth.logout(function() {}, errorCallback);
