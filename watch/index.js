(function() {
  if (location.hash.split("#")[1]) {
    var alias = location.hash.split("#")[1];
    console.log(alias);
    var key = "";
    var uid = "";
    var slC = "";
    var slT = "";
    var slK = "";
    var order = [];
    var sN = 0;
    displaySlide = function() {
      slT = order[sN][1];
      slK = order[sN][0];
      fb.child("presentations/" + uid + "/" + key + "/slides/" + slT + "/" + slK).once("value", function(slideSnapshot) {
        var slC = slideSnapshot.val()[slT == "content" ? "contents" : "query"];
        console.log(slC);
        $('#slideContents').html(slC);
        var submit = function() {
          var content = $('#respC').val();
          fb.child("presentations/" + uid + "/" + key + "/slides/questions/" + slK + "/responses/" + fb.getAuth().uid).set({
            "content": content,
            "type": "string",
            "name": fb.getAuth().google.displayName
          });
        };
        if (slT == "questions") {
          $('#qI').slideDown();
          $('#respC').on("keypress", function(e) {
            if (e.keyCode == 13) {
              submit();
            }
          });
          $('#respS').on('click', function() {
            submit();
          });
        } else {
          $('#qI').slideUp();
          $('#respC').off("keypress");
          $('#respS').off("keypress");
        }
      });
    };
    fb.child("aliases").child(alias).once("value", function(aliasSnapshot) {
      key = aliasSnapshot.val().key;
      uid = aliasSnapshot.val().uid;
      console.log(key, uid);
      fb.child("presentations/" + uid + "/" + key + "/presenting_clientsJoined/" + fb.getAuth().uid).set({
        name: fb.getAuth().google.displayName
      });
      fb.child("presentations/" + uid + "/" + key + "/presenting_clientsJoined/" + fb.getAuth().uid).onDisconnect().remove();
      //
      fb.child("presentations/" + uid + "/" + key + "/presenting_currentSlide").on("value", function(cSSnapshot) {
        sN = cSSnapshot.val().s;
        console.log(sN);
        fb.child("presentations/" + uid + "/" + key + "/order").once("value", function(orderSnapshot) {
          order = orderSnapshot.val();
          console.log(order);
          displaySlide();
        });
      });
    });
  } else {
    location.assign("/dashboard/learn");
  }
})();