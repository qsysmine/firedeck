(function() {
  //Popup behaviour
  var auth = fb.getAuth();
  if (auth == null || auth.provider != "google") {
    location.assign("/#l");
  }
  //UI stuff
  $('.usName').text(auth.google.displayName);
  //Logout behaviour
  $('.btn#logout').click(function() {
    if (fb.getAuth != null) {
      fb.unauth();
    }
    location.assign("/#");
  });
  //Username behaviour
  var userDataPath = fb.child("users").child(auth.uid);
  userDataPath.once("value", function(snap) {
    userData = snap.val();
  });

})();