tauth = function() {
  if (ref.getAuth() == null) {
    ref.authWithOAuthPopup("google", function(error, authData) {

      console.log("Authenticated successfully with payload:", authData);
      location.assign("/dashboard/teach#welcome");
    });
  } else {
    location.assign("./dashboard/teach");
  }
}
sauth = function() {
  if (ref.getAuth() == null) {
    ref.authWithOAuthPopup("google", function(error, authData) {

      console.log("Authenticated successfully with payload:", authData);
      location.assign("./dashboard/learn#welcome");
    });
  } else {
    location.assign("./dashboard/learn");
  }
}
if (location.hash == "#l") {
  $('#main').prepend("<div class=\"alert alert-warning alert-dismissible\" id=\"wAlert\" role=\"alert\"><button type=\"button\" class=\"close\" data-ui=\"Q\" data-uiQCl=\"#wAlert\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button>Please log in with the buttons in the navigation bar above.</div>");
  attachUiEvents();
}
