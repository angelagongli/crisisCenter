# Corona Crisis Center

## Description
The Corona Crisis Center is a full stack application aggregating corona news and statistics all in one place.

Upon sign-in, the app provides the user with the ability to bookmark and share this content with members of their user family via email. The app has a bookmarks page where the user can view and manage their bookmarks, and inbox/outbox pages where the app's internal record of the user's sent/received email is stored.

At the community area of the app, there are community features such as a forum where users can interact by adding posts and comments and a page where users can share ideas for staying busy during quarantine.

The Corona Crisis Center app is deployed to Heroku here: http://crisiscenter.herokuapp.com/

## Usage
Create an account on the [sign up page](http://crisiscenter.herokuapp.com/signup) and then log in at the [root URL](http://crisiscenter.herokuapp.com/).

![homepage img](/homepage.png)

Upon log-in, the user can view, bookmark or share content on the homepage as shown above. The blue buttons appended to each corona-related New York Times article or tweet have bookmark and email functionality, and bookmarked content and sent/received emails can be viewed on the Bookmarks and Oubox/Intbox pages respectively.

## Credits
The Corona Crisis Center app is built on the MVC paradigm and uses the promise-based Sequelize ORM to define its models and a MySQL database to store them, and an Express server to control routing and interact with the database by calling Sequelize methods.

The app relies on the following web APIs:
* [Twilio SendGrid API](https://sendgrid.com/docs/API_Reference/api_v3.html) to send email
* [New York Times Article Search API](https://developer.nytimes.com/docs/articlesearch-product/1/overview) to perform article search on the keyword of coronavirus
* [Twitter Lists API](https://developer.twitter.com/en/docs/accounts-and-users/create-manage-lists/api-reference/get-lists-statuses) to return tweet data

The following npm modules are required in the project files and listed in the `package.json`:
* [Express](http://expressjs.com/) to create the server
* [Express Handlebars](https://www.npmjs.com/package/express-handlebars) to render Handlebars templates
* [mysql](https://www.npmjs.com/package/mysql) and [mysql2](https://www.npmjs.com/package/mysql2) to connect to the MySQL database, and the [sequelize](https://www.npmjs.com/package/sequelize) ORM to define its models and query the MySQL database
* [axios](https://www.npmjs.com/package/axios) to make routed frontend API calls from the backend
* The [@sendgrid/mail](https://www.npmjs.com/package/@sendgrid/mail) and [twitter](https://www.npmjs.com/package/twitter) npm modules to use the SendGrid API and Twitter API respectively
* [Passport](https://www.npmjs.com/package/passport) and its [passport-local](http://www.passportjs.org/packages/passport-local/) authentication strategy to sign in the user
* [express-session](https://www.npmjs.com/package/express-session) to create the session middleware and [bcrypt](https://www.npmjs.com/package/bcryptjs) to perform password hashing and check a hashed password against an unhashed one

The [JawsDB](https://devcenter.heroku.com/articles/jawsdb) Heroku add-on runs an instance of MySQL in the cloud and stores the user data on the deployed app.

The [jQuery](https://jquery.com/) JavaScript library is used to write the client side JS.

The authentication and NYTimes article search features of the app build directly on two class activities authored by the Coding Boot Camp at UT (Passport demo and NYTimes search app).

The [COVID 19 map and dashboard](https://coronavirus.jhu.edu/map.html) shown on the `members` page was made by CSSE at Johns Hopkins University. The icons were taken from the collection of icons at [Font Awesome](https://fontawesome.com/), and the responsive CSS on the site pages is from [Bootstrap](https://getbootstrap.com/).

## Future Development

By default everybody is assigned a user family of null, and we want our project to be able to hand over control of the user family to the user through invitation functionality.