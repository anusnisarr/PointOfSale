const navContainer = $(".nav-container").hide()

// Show/hide navigation container based on mouse position
$(document).on("mousemove", (e) => {
    if (e.clientY < 10) {
      // Mouse is near the top of the viewport
      navContainer.css("top", "10px");
    } else if (e.clientY > 63) {
      // Mouse is away from the top
      navContainer.css("top", "-50px");
    }
  });
// Prevent the navigation container from flashing on load
$(document).ready(function () {
  $.get("nav.html", function (data) {
    $(".nav-container").html(data).show();
  });
});
  