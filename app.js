const express = require('express');
const app = express();

// Basic rate limiting.
// See the docs here: https://www.npmjs.com/package/express-rate-limit
var RateLimit = require('express-rate-limit');
app.enable('trust proxy');  // this server is hosted on a reverse proxy (Heroku)

var limiter = new RateLimit({
  windowMs: 5*60*1000, // 5 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  delayMs: 0 // disable delaying - full speed until the max limit is reached
});

app.use(limiter);


// Catch-all security package for Express.
var helmet = require('helmet');
app.use(helmet());


// TODO: CORS


// App secrets are stored in the .env file
require('dotenv').config();


/*
*
*
    All of our app logic goes below this section.
*
*
*/

var twitterHelpers = require('./twitter-api-helpers.js');


app.get('/', function(req, res) {
  res.send('Hello World!')
});

app.get('/tweets', function(req, res) {
  twitterHelpers.searchTwitter('nasa&result_type=popular')
    .then(function(response) {
      res.json(response);
    })
    .catch(function(error) {
      res.json(error);
    });
});

app.listen(3000, function() {
  console.log('Example app listening on port 3000!')
});