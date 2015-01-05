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
      });
    };
    fb.child("aliases").child(alias).once("value", function(aliasSnapshot) {
      key = aliasSnapshot.val().key;
      uid = aliasSnapshot.val().uid;
      console.log(key, uid);
      fb.child("presentations/" + uid + "/" + key + "/presenting_currentSlide").on("value", function(cSSnapshot) {
        sN = cSSnapshot.val();
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