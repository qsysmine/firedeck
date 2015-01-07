(function() {
  var ref = new Firebase("https://firedeck.firebaseio.com");
  if (ref.getAuth() == null) {
    ref.authWithOAuthRedirect("google", function(error, authData) {

      console.log("Authenticated successfully with payload:", authData);
      location.assign("/dashboard/teach#welcome");
    });
  } else {
    location.assign("/dashboard/teach");
  }
})();