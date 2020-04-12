// Requiring path to so we can use relative routes to our HTML files
var path = require("path");
var axios = require("axios");
var Twitter = require("twitter");

// Requiring our custom middleware for checking if a user is logged in
var isAuthenticated = require("../config/middleware/isAuthenticated");

module.exports = function(app) {
  app.get("/", function(req, res) {
    // If the user already has an account send them to the members page
    if (req.user) {
      res.redirect("/members");
    }
    res.sendFile(path.join(__dirname, "../public/login.html"));
  });

  app.get("/signup", function(req, res) {
    // If the user already has an account send them to the members page
    if (req.user) {
      res.redirect("/members");
    }
    res.sendFile(path.join(__dirname, "../public/signup.html"));
  });
 
  app.get("/members", isAuthenticated, function(req, res){
    res.sendFile(path.join(__dirname, "../public/members.html"));
  })

    app.get("/staybusy", isAuthenticated, function(req, res) {
      res.sendFile(path.join(__dirname, "../public/staybusy.html"));
    });


    app.get("/forum", isAuthenticated, function(req, res) {
      // If the user is logged in, send them to the forum page
      res.sendFile(path.join(__dirname, "../public/forum.html"));
    });
  });

  // const queryURL = "https://api.twitter.com/1.1/lists/list.json?user_id=PennStateBrit";
  // axios
  //   .get(queryURL)
  //   .then(function(response) {
  //     const data = response.entities;
  //     console.log(response);
  //     const twitterDiv = $(".twitter");
  //     twitterDiv.append(data);
  //   });
};
