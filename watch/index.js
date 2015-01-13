(function() {
  if (location.hash.split("#")[1]) {
    var alias = location.hash.split("#")[1];
    console.log(alias);
    var key = "";
    var uid = "";
    var sK = "";
    var displaySlide = function() {
      fb.child("presentations/" + uid + "/" + key + "/slides/" + sK + "/html").once("value", function(htmlSnap) {
        $('#slideContents').html(htmlSnap.val());
      });
      fb.child("presentations/" + uid + "/" + key + "/slides/" + sK + "/type").once("value", function(valueSnap) {
        if (valueSnap.val() == "query") {
          $('#qI').show();
          var submitResponse = function() {
            var responseContent = $('#respC').val();
            var responseType = "text";
            var responseName = fb.getAuth().google.displayName;
            fb.child("presentations/" + uid + "/" + key + "/slides/" + sK + "/responses/" + fb.getAuth().uid).set({
              name: responseName,
              type: responseType,
              content: responseContent
            }, function() {
              $('#qI').prepend("<div class=\"alert alert-success alert-dismissible\" id=\"submAlert\" role=\"alert\"><button type=\"button\" class=\"close\" data-ui=\"Q\" data-uiQCl=\"#submAlert\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button>Response Submitted.</div>");
              attachUiEvents();
            });
          };
          $('#respS').click(function() {
            submitResponse();
          });
          $('#respC').keypress(function(e) {
            if (e.keyCode == 13) {
              submitResponse;
            }
          });
        } else {
          $('#qI').hide();
          $('#respS').off("click");
          $('#respC').off("keypress");
        }
      });
    };
    fb.child("aliases").child(alias).once("value", function(aliasSnapshot) {
      key = aliasSnapshot.val().key;
      uid = aliasSnapshot.val().uid;
      fb.child("presentations/" + uid + "/" + key + "/presenting_clientsJoined/" + fb.getAuth().uid).set({
        name: fb.getAuth().google.displayName
      });
      fb.child("presentations/" + uid + "/" + key + "/presenting_clientsJoined/" + fb.getAuth().uid).onDisconnect().remove();
      //
      fb.child("presentations/" + uid + "/" + key + "/presenting_currentSlide").on("value", function(cSSnapshot) {
        sK = cSSnapshot.val();
        displaySlide();
      });
    });
  } else {
    location.assign("/dashboard/learn");
  }
})();