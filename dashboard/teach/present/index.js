(function() {
  if (location.hash == "#") {
    location.assign("/dashboard/teach");
  } else {
    var presKey = location.hash.split("#")[1];
    var presData = {};
    var getSlide = function(sK, push) {
      if (push) {
        $('#slideContents').html(presData.slides[sK].html);
      }
      return presData.slides[sK];
    };
    var getSlideList = function() {
      return presData.slides;
    };
    var getSlideNumber = function(sK) {
      var n = 0;
      for (var k in getSlideList()) {
        if (k == sK) {
          return n;
        }
        n++;
      }
      return -1;
    };
    var getNextSlide = function(sK) {
      var sN = getSlideNumber(sK);
      return Object.keys(getSlideList())[sN + 1];
    };
    var getPrevSlide = function(sK) {
      var sN = getSlideNumber(sK);
      return Object.keys(getSlideList())[sN - 1];
    };
    var presAlias = "";
    var updatePresentation = function() {
      var sN = presData.presenting_currentSlide;
      getSlide(sN, true);
      $('.presName').text(presData.name);
      var sN2 = getSlideNumber(sN) + 1;
      $('#slideNumber').text("Slide " + sN2 + ";");
      if (sN2 >= Object.keys(getSlideList()).length) {
        $('#nextSlide').attr("disabled", "disabled");
      } else {
        $('#nextSlide').removeAttr("disabled");
      }
      if (sN2 == 1) {
        $('#prevSlide').attr("disabled", "disabled");
      } else {
        $('#prevSlide').removeAttr("disabled");
      }
      if (getSlide(sN).type == "query") {
        $('#responsesC').show();
        $('#responses').html("");
        for (var k in presData.slides[sN].responses) {
          var r = presData.slides[sN].responses[k];
          var c = r.content;
          var t = r.type;
          var u = r.name;
          $('#responses').append("<li class=\"list-group-item\"><b>" + u + "</b><br/>" + c + "</li>")
        }
      } else {
        $('#responses').html("");
        $('#responsesC').hide();
      }
    };
    var activatePresentation = function() {
      var url = "http://firedeck.tk/watch#" + presAlias;
      $('#aliasLink').text(presAlias).attr("href", url);
      _modal({
        title: "Presentation is Live!",
        body: "<p><br/><b>URL:</b> <a href=\"" + url + "\">" + url + "</a><br/><b>Key [for student dashboard]:</b> " + presAlias + "</p>",
        footer: "<span id=\"clM\" class=\"btn btn-success\">Close</span>"
      });
      $('#clM').click(function() {
        $('#clM').off("click");
        _modal({
          "close": true
        });
      });
      fb.child("presentations/" + fb.getAuth().uid + "/" + presKey + "/presenting_currentSlide").set(Object.keys(presData.slides)[0]);
      fb.child("aliases").child(presAlias).set({
        uid: fb.getAuth().uid,
        key: presKey
      });
      fb.child("aliases").child(presAlias).onDisconnect().remove();
    };
    $('#nextSlide').click(function() {
      var currentSlide = presData.presenting_currentSlide;
      console.log(this, currentSlide);
      var slideNumber = getSlideNumber(currentSlide);
      console.log(slideNumber);
      if (slideNumber < Object.keys(getSlideList()).length) {
        currentSlide = getNextSlide(currentSlide);
        console.log(currentSlide);
        getSlide(currentSlide, true);
        //renderList();
        fb.child("presentations/" + fb.getAuth().uid + "/" + presKey + "/presenting_currentSlide").set(currentSlide);
      }
    });
    $('#prevSlide').click(function() {
      var currentSlide = presData.presenting_currentSlide;
      var slideNumber = getSlideNumber(currentSlide);
      if (slideNumber > 0) {
        currentSlide = getPrevSlide(currentSlide);
        getSlide(currentSlide, true);
        //renderList();
        fb.child("presentations/" + fb.getAuth().uid + "/" + presKey + "/presenting_currentSlide").set(currentSlide);
      }
    });
    fb.child("presentations/" + fb.getAuth().uid + "/" + presKey).once("value", function(snap) {
      presData = snap.val();
      if (presData.alias != null) {
        presAlias = presData.alias;
      } else {
        presAlias = makeName();
      }
      activatePresentation();
    });
    fb.child("presentations/" + fb.getAuth().uid + "/" + presKey).on("value", function(snap) {
      presData = snap.val();
      updatePresentation();
    });
    fb.child("presentations/" + fb.getAuth().uid + "/" + presKey + "/presenting_clientsJoined").on("value", function(snap) {
      if (snap.val() != null) {
        $('#clientNums').text(Object.keys(snap.val()).length + " viewers");
      }
    });
  }
})();