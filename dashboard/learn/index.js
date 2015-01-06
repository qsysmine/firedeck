(function() {
  var doPresentation = function() {
    location.assign("/watch#" + $('#ssN').val())
  };
  $('#ssG').click(function() {
    doPresentation();
  });
  $('#ssN').keypress(function(e) {
    if ($('#ssN').val() != "") {
      $('#ssG').removeAttr("disabled");
    } else {
      $('#ssG').attr("disabled", "true");
    }
    if (e.keyCode == 13) {
      doPresentation();
    }
  });
})();