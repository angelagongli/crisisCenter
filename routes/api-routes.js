// Requiring our models and passport as we've configured it
var db = require("../models");
var passport = require("../config/passport");

var exphbs = require("express-handlebars");

var Twitter = require("twitter");


module.exports = function(app) {
  // Using the passport.authenticate middleware with our local strategy.
  // If the user has valid login credentials, send them to the members page.
  // Otherwise the user will be sent an error
  app.post("/api/login", passport.authenticate("local"), function(req, res) {
    // Sending back a password, even a hashed password, isn't a good idea
    res.json({
      email: req.user.email,
      id: req.user.id
    });
  });

  // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
  // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
  // otherwise send back an error
  app.post("/api/signup", function(req, res) {
    db.User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    })
      .then(function() {
        res.redirect(307, "/api/login");
      })
      .catch(function(err) {
        res.status(401).json(err);
      });
  });

  // Route for logging user out
  app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
  });

  // Route for getting some data about our user to be used client side
  app.get("/api/user_data", function(req, res) {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    } else {
      // Otherwise send back the user's email and id
      // Sending back a password, even a hashed password, isn't a good idea
      res.json({
        name: req.user.name,
        email: req.user.email,
        id: req.user.id
      });
    }
  });


  app.get("/posts", function(req, res) {
    db.Post.findAll({}).then(posts => {
      res.json(posts);
    });
  });

  app.post("/posts", function(req, res) {
    db.Post.create({
      title: req.body.title,
      body: req.body.body
    }).then(() => res.json({}));
  });

  app.get("/forum/:id", function(req, res) {
    app.engine("handlebars", exphbs({ defaultLayout: "forum" }));
    app.set("view engine", "handlebars");
    db.Post.findOne({
      where: {
        id: req.params.id
      }
    }).done(function(post) {
      app.render("post", {
        title: post.title,
        body: post.body
      });
    });
  });
};

  app.get("/tweets", function(req, res) {
    var client = new Twitter({
      consumer_key: process.env.consumer_key,
      consumer_secret: process.env.consumer_secret,
      access_token_key: process.env.access_token_key,
      access_token_secret: process.env.access_token_secret
    });

    client.get('lists/statuses.json', {list_id: '1246463879271657474'}, function(error, tweets, response) {
      if(error) console.log(error);
      console.log(tweets); 
        res.json(tweets);
    });
})};

