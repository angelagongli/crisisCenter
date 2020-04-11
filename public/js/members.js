const passport = require("passport");

$(document).ready(function() {
  // This file just does a GET request to figure out which user is logged in
  // and updates the HTML on the page
  $.get("/api/user_data").then(function(data) {
    $(".member-name").text(data.name);
  });
});

// const queryURL = "https://api.twitter.com/1.1/lists/list.json?user_id=PennStateBrit";

// $.ajax({
//   url: queryURL,
//   method: "GET"
// }).then(function(response) {
//   const data = response.entities;
//   console.log(response);
//   const twitterDiv = $(".twitter");
//   twitterDiv.append(data);
// });
