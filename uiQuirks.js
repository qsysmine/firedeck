(function() {
  var colour = "#FFF";
  if (location.hash == "#welcome") {
    console.log(location.hash);
    $('#main,#mainDash').prepend("<div class=\"alert alert-success alert-dismissible\" id=\"wAlert\" role=\"alert\"><button type=\"button\" class=\"close\" data-ui=\"Q\" data-uiQCl=\"#wAlert\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button>Welcome, <span class=\"usName\">[loading]</span></div>");
  }
  if (location.pathname.split("/firedeck.tk")[0] == "") {
    location.assign("http://firedeck.tk" + location.pathname.split("/firedeck.tk")[1]);
  }
  if (fb.getAuth() != null) {
    fb.child("users/" + fb.getAuth().uid + "/colour").on("value", function(snaparoon) {
      colour = snaparoon.val();
      $('div.navbar').css({
        "background-color": (colour != null ? colour : "#FFF")
      });
    });
  }
  window.attachUiEvents = function() {
    /*
    $('*.close[data-ui="Q"]').on("click", function() {
      $(this).slideUp(200);
      var elToClose = $($(this).attr("data-uiQCl"));
      elToClose.animate({
        "font-size": 0
      }, 200, "swing", function() {
        elToClose.animate({
          width: "0vh"
        }, 400, "swing", function() {
          elToClose.slideUp();

        });
      });
    });
    */

    $('*.close[data-ui="Q"]').on("click", function() {
      var elToClose = $($(this).attr("data-uiQCL"));
      elToClose.slideUp();
      if (location.hash == "#welcome" || location.hash == "#l") {
        location.hash = "";
      }
    });

  };
  window.doColour = function() {
    $('input.col').val((colour != null ? colour : "#FFF"));
  }
  var _modal = function(options) {
    if (options.close) {
      $('#modal').modal("hide");
      $('#modalLabel').text("Label");
      $('#modalBody').html("Body");
      $('#modalFooter').html("Footer");
    } else {
      if (options.title) {
        $('#modalLabel').text(options.title);
      }
      if (options.body) {
        $("#modalBody").html(options.body);
      }
      if (options.footer) {
        $('#modalFooter').html(options.footer);
      }
      $('#modal').modal();
    }
  };
  window._modal = _modal;
  attachUiEvents();
})();
