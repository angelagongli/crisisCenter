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
  app.get("/members", isAuthenticated, function(req, res) {
    res.sendFile(path.join(__dirname, "../public/members.html"));
  });

  app.get("/staybusy", isAuthenticated, function(req, res) {
    res.sendFile(path.join(__dirname, "../public/staybusy.html"));
  });

  app.get("/forum", isAuthenticated, function(req, res) {
    // If the user is logged in, send them to the forum page
    res.sendFile(path.join(__dirname, "../public/forum.html"));
  });

  app.get("/bookmarks", isAuthenticated, function(req, res) {
    db.Bookmark.findAll({
      where: { UserId: req.user.id }
    })
      .then(data => {
        res.render("bookmarks", { bookmarks: data });
      })
      .catch(function(err) {
        res.status(401).json(err);
      });
  });
  app.get("/inbox", isAuthenticated, function(req, res) {
    db.Email.findAll({
      where: { recipientID: req.user.id }
    })
      .then(data => {
        db.User.findAll({
          attributes: ["name", "email", "id"]
        }).then(senderData => {
          let senderLookup = {};
          for (sender of senderData) {
            senderLookup[sender.id] = `${sender.name} (${sender.email})`
          }
          console.log("Returned by Sequelize...");
          console.log(data);
          let emailsWithSenders = [];
          for (record of data) {
            let recordWithSender = record.toJSON();
            recordWithSender.senderInfo = senderLookup[record.UserId];
            emailsWithSenders.push(recordWithSender);
          }
          console.log("Passed to Handlebars...");
          console.log(emailsWithSenders);
          res.render("inbox", { emails: emailsWithSenders });
        });
      })
      .catch(function(err) {
        res.status(401).json(err);
      });
  });
  app.get("/outbox", isAuthenticated, function(req, res) {
    db.Email.findAll({
      where: { UserId: req.user.id }
    })
      .then(data => {
        db.User.findAll({
          attributes: ["name", "email", "id"]
        }).then(recipientData => {
          let recipientLookup = {};
          for (recipient of recipientData) {
            recipientLookup[recipient.id] = `${recipient.name} (${recipient.email})`
          }
          console.log("Returned by Sequelize...");
          console.log(data);
          let emailsWithRecipients = [];
          for (record of data) {
            let recordWithRecipient = record.toJSON();
            recordWithRecipient.recipientInfo = recipientLookup[record.recipientID];
            emailsWithRecipients.push(recordWithRecipient);
          }
          console.log("Passed to Handlebars...");
          console.log(emailsWithRecipients);
          res.render("outbox", { emails: emailsWithRecipients });
        });
      })
      .catch(function(err) {
        res.status(401).json(err);
      });
  });
  app.get("/staybusy", isAuthenticated, function(req, res) {
    db.Idea.findAll({
      where: { UserId: req.user.id }
    })
      .then(data => {
        res.render("newIdea", { ideas: data });
      })
      .catch(function(err) {
        res.status(401).json(err);
      });
  });
  app.post("/staybusy", function(req, res) {
    db.Idea.create({
      title: req.body.title,
      body: req.body.body,
      user: req.body.user
    }).then(dbPost => res.json({ dbPost }));
  });

  app.get("/forum/:id", isAuthenticated, function(req, res) {
    db.Post.findOne({
      where: {
        id: req.params.id
      }
    }).then(post => {
      // console.log(post);
      res.render("post", {
        title: post.title,
        body: post.body
      });
    });
  });

  app.get("/staybusy", function(req, res) {
    db.Idea.findAll({}).then(ideas => {
      res.json(ideas);
    });
  });
  app.get("/staybusy/ideas", function(req, res) {
    db.Idea.findAll({}).then(data => {
      res.json(data);
    });
  });

  app.post("/staybusy", function(req, res) {
    db.Idea.create({
      title: req.body.title,
      body: req.body.body,
      user: req.body.user
    }).then(() => res.json({}));
  });
};
