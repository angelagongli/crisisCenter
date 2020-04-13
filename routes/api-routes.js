// Requiring our models and passport as we've configured it
var db = require("../models");
var passport = require("../config/passport");
var exphbs = require("express-handlebars");
var axios = require("axios");
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

  app.post("/api/emails", function(req, res) {
    db.Email.create({
      content: req.body.content,
      text: req.body.text,
      subject: req.body.subject,
      message: req.body.message,
      UserId: req.body.userID,
      recipientID: req.body.recipientID
    })
      .then(function(data) {
        const sgMail = require('@sendgrid/mail');
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);

        let textString = req.body.message + " -- Sent by " + 
          req.body.userName + " (" + 
          req.body.userEmail + "): " + 
          req.body.text;

        let HTMLString = req.body.message + "<br><br>Sent by " + 
          req.body.userName + " (" + 
          req.body.userEmail + ")<br><br>" + 
          req.body.content;

        const msg = {
          to: req.body.recipientEmail,
          from: "coronacrisiscenter@gmail.com",
          subject: req.body.subject,
          text: textString,
          html: HTMLString,
        };
        
        sgMail
          .send(msg)
          .then(() => {}, error => {
            console.error(error);
         
            if (error.response) {
              console.error(error.response.body)
            }
          });

        res.json(data);
      })
      .catch(function(err) {
        res.status(401).json(err);
      });
  });

  app.post("/api/bookmarks", function(req, res) {
    db.Bookmark.create({
      content: req.body.content,
      text: req.body.text,
      note: req.body.note,
      UserId: req.body.userID
    })
      .then(function(data) {
        res.json(data);
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


  app.get("/api/user_family_data", function(req, res) {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    } else {
      db.User.findAll({
        attributes : ["name", "email", "id"],
        where : { FamilyId: req.user.FamilyId }
      }).then(data => {
        res.json(data);
      }).catch(function(err) {
        res.status(401).json(err);
      });
    }
  });

  app.get("/api/emails/outbox", function(req, res) {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    } else {
      db.Email.findAll({
        where : {UserId: req.user.id }
      }).then(data => {
        res.json(data);
      }).catch(function(err) {
        res.status(401).json(err);
      });
    }
  });
  
  app.get("/api/emails/inbox", function(req, res) {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    } else {
      db.Email.findAll({
        where : {recipientID: req.user.id }
      }).then(data => {
        res.json(data);
      }).catch(function(err) {
        res.status(401).json(err);
      });
    }
  });

  app.get("/api/bookmarks", function(req, res) {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    } else {
      db.Bookmark.findAll({
        where : {UserId: req.user.id }
      }).then(data => {
        res.json(data);
      }).catch(function(err) {
        res.status(401).json(err);
      });
    }
  });

  app.get("/api/nytimes", function(req, res) {
    let queryURL = "https://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=7zg49YbZEaOjLSJIGYvO0nYJbHwmIQHa&q=coronavirus"
    axios.get(queryURL)
      .then(response => {
        console.log(response.data);
        res.json(response.data);
      })
      .catch(function(err) {
        res.status(401).json(err);
      });
  });


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

    
});
};
