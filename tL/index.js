(function() {
  var ref = new Firebase("https://firedeck.firebaseio.com");
  if (ref.getAuth() == null) {
    ref.authWithOAuthPopup("google", function(error, authData) {
      if (error) {
        console.log("Login Failed!", error);
      } else {
        console.log("Authenticated successfully with payload:", authData);
        location.assign("/dashboard/teach#welcome");
      }
    });
  } else {
    location.assign("/dashboard/teach");
  }
})();
