(function() {
  var user = fb.child("users/" + fb.getAuth().uid);
  user.on("value", function(snapshot) {
    var userData = snapshot.val();
    if (userData != null) {
      if (userData.presentations == null) {
        $('#presentations').hide();
      } else {
        $('.presNumber').text(Object.keys(userData.presentations).length);
        $('#presList').html("");
        for (var name in userData.presentations) {
          var presentationName = userData.presentations[name].name;
          console.log("Rendering Presentation: " + presentationName);
          $('#presList').append("<li data-pres=\"" + name + "\" class=\"presentationLink list-group-item\">" + presentationName + "</li>");
        }
        $('.presentationLink').click(function() {
          console.log("cliq");
          var presKey = $(this).attr("data-pres");
          initEditor();
          editPresentation(false, presKey);
        });
      }
    }
  });
  //New Presentation
  $('#newPres').click(function() {
    console.log("Initialising new Pres.");
    _modal({
      "title": "New Presentation",
      "body": "<div id=\"newPresError\"></div><div class=\"form-group\"><input type=\"text\" placeholder=\"Presentation Name\" class=\"form-control\" id=\"newPresName\"></div>",
      "footer": "<span class=\"btn btn-success\" id=\"newPresCreate\">Create</span>."
    });
    var newPres = function() {
      if ($('#newPresName').val() != "" && $('#newPresName').val() != null) {
        initEditor();
        editNewPresentation($('#newPresName').val());
        _modal({
          "close": true
        });
      } else {
        $('#newPresError').html("<div class=\"alert alert-danger alert-dismissible\" id=\"newPresAlert\" role=\"alert\"><button type=\"button\" class=\"close\" data-ui=\"Q\" data-uiQCl=\"#newPresAlert\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button>Your title cannot be empty</div>");
        attachUiEvents();
      }
    };
    $('#newPresCreate').click(newPres);
    $('#newPresName').keyup(function(e) {
      if (e.keyCode == 13) {
        newPres();
      }
    });
  });
  //Set Colour
  $('#setColour').click(function() {
    _modal({
      title: "Set your Favourite Colour",
      body: "<div class\"form-group\"><input type=\"color\" id=\"newColor\" class=\"col form-control\"></div>",
      footer: "<span class=\"btn btn-info\" id=\"newColorSet\">Set Colour</span>"
    });
    doColour();
    $('#newColorSet').click(function() {
      $('#newColorSet').off("click");
      var colour = $('#newColor').val();
      fb.child("users/" + fb.getAuth().uid + "/colour").set(colour);
      _modal({
        close: true
      });
    });
  });
})();