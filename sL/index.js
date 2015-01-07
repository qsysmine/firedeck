(function() {
  var ref = new Firebase("https://firedeck.firebaseio.com");
  if (ref.getAuth() == null) {
    ref.authWithOAuthRedirect("google", function(error, authData) {

      location.assign("/dashboard/learn#welcome");
    });
  } else {
    location.assign("/dashboard/learn");
  }
})();