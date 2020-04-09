$(document).ready(function() {
    $.get("/api/user_data").then(function(data) {
      $(".member-name").text(data.name);
    });
  });

$(document).ready(function(){
    const stayBusy = $("div#stayBusy");

stayBusy.on("click", function(){
    $.get("/staybusy")
});

});