// Requiring path to so we can use relative routes to our HTML files
var path = require("path");
var axios = require("axios");

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

  // Here we've add our isAuthenticated middleware to this route.
  // If a user who is not logged in tries to access this route they will be redirected to the signup page
  app.get("/members", isAuthenticated, function(req, res) {
    res.sendFile(path.join(__dirname, "../public/members.html"));

    app.get("/staybusy", isAuthenticated, function(req, res) {
      res.sendFile(path.join(__dirname, "../public/staybusy.html"));
    });

    app.get("/forum", isAuthenticated, function(req, res) {
      // If the user is logged in, send them to the forum page
      res.sendFile(path.join(__dirname, "../public/forum.html"));
    });
    app.get("/post", isAuthenticated, function(req, res) {
      // If the user is logged in, send them to the forum page
      res.sendFile(path.join(__dirname, "../public/post.html"));
    });
  });
};
