// Requiring path to so we can use relative routes to our HTML files
var path = require("path");
var db = require("../models");
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

  app.get("/bookmarks", isAuthenticated, function(req, res) {
    db.Bookmark.findAll({
      where : {UserId: req.user.id }
    }).then(data => {
      res.render("bookmarks", { bookmarks: data });
    }).catch(function(err) {
      res.status(401).json(err);
    });
  });

  app.get("/inbox", isAuthenticated, function(req, res) {
    db.Email.findAll({
      where : {recipientID: req.user.id }
    }).then(data => {
      res.render("inbox", { emails: data });
    }).catch(function(err) {
      res.status(401).json(err);
    });
  });

  app.get("/outbox", isAuthenticated, function(req, res) {
    db.Email.findAll({
      where : {UserId: req.user.id }
    }).then(data => {
      res.render("outbox", { emails: data });
    }).catch(function(err) {
      res.status(401).json(err);
    });
  });
};
