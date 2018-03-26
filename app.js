const express = require('express');
const cors = require('cors');
const app = express();


// Basic rate limiting.
// Docs: https://www.npmjs.com/package/express-rate-limit
var RateLimit = require('express-rate-limit');
app.enable('trust proxy');  // this server is hosted on a reverse proxy (Heroku)

var limiter = new RateLimit({
  windowMs: 5*60*1000, // 5 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  delayMs: 0 // disable delaying - full speed until the max limit is reached
});

app.use(limiter);


// Configure CORS
// Docs: https://github.com/expressjs/cors
var whitelist = [
  'https://mlh-tweet-scraper.firebaseapp.com'
];

var localWhitelist = [
  'http://localhost:3000'
];

if (!process.env.PORT) {
  localWhitelist.forEach(function(url) {
    whitelist.push(url);
  });
}

var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS: ', origin));
    }
  }
};


// Catch-all security package for Express.
// Docs: https://expressjs.com/en/advanced/best-practice-security.html#use-helmet
var helmet = require('helmet');
app.use(helmet());


// App secrets are stored in the .env file.
require('dotenv').config();


/*
 *
 *
    All of our app logic goes below this section.
 *
 *
 */

var twitterApi = require('./js/twitter-api');

app.get('/', function(req, res) {
  res.send('Hello World!')
});

app.get('/tweets', cors(corsOptions), function(req, res) {
  twitterApi.searchTwitter(req.query.searchQuery)
    .then(function(response) {
      res.json(response);
    })
    .catch(function(error) {
      res.json(error);
    });
});

// 3001 is our localhost port
const port = process.env.PORT || 3001;

app.listen(port, function() {
  console.log('Listening on ', port);
});