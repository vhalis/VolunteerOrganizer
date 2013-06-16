var accessToken;

var logit = function(data) {
  console.log("Logging");
  console.log(data);
}

var errorCallback = function(err) {
  console.log(err);
}



var getUserProfileSuccessCallback = function(profile) {
  document.getElementById("statusBox").innerHTML +=
    "<br/>Get User Profile Success! User: "
    + profile.basic.firstName;
}

var loginSuccessCallback = function(data) {
  intel.profile.getUserProfile (getUserProfileSuccessCallback, errorCallback);
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

intel.auth.init({
    clientId: 'ca0d219c6090696396f1b2ab4718e18e',
    secretId: 'ae7163fddba0bc48',
    scope: 'user:details user:scope profile:full'
  },
  initSuccessCallback, 
  errorCallback
);
