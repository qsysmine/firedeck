tauth = function() {
  if (ref.getAuth() == null) {
    ref.authWithOAuthPopup("google", function(error, authData) {

      console.log("Authenticated successfully with payload:", authData);
      location.assign("/dashboard/teach#welcome");
    });
  } else {
    location.assign("/dashboard/teach");
  }
}
sauth = function() {
  if (ref.getAuth() == null) {
    ref.authWithOAuthPopup("google", function(error, authData) {

      console.log("Authenticated successfully with payload:", authData);
      location.assign("/dashboard/teach#welcome");
    });
  } else {
    location.assign("/dashboard/learn");
  }
}
if (location.hash == "#l") {
  $('body').prepend("<div class=\"alert alert-success alert-dismissible\" id=\"wAlert\" role=\"alert\"><button type=\"button\" class=\"close\" data-ui=\"Q\" data-uiQCl=\"#wAlert\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button>Welcome, <span class=\"usName\">[loading]</span></div>");
}