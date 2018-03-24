require('dotenv').config();
var axios = require('axios');

// Since btoa() isn't automatically included in Node, recreate it here.
// Source: https://github.com/node-browser-compat/btoa/blob/master/index.js
var btoa = function(str) {
  var buffer;

  if (str instanceof Buffer) {
    buffer = str;
  } else {
    buffer = new Buffer(str.toString(), 'binary');
  }

  return buffer.toString('base64');
};

/*
 *
 *
    We'll store the tokens returned from Twitter
    in the server's memory. Never return them to the client.
    This is a dead-simple solution; for more features and
    security, try an in-memory data store like redis.

    Source on Twitter API Authorization:
    https://developer.twitter.com/en/docs/basics/authentication/overview/application-only
 *
 *
 */

module.exports = {
  tokenCredentials: null,
  bearerToken: null,
  getTokenCredentials: function() {
    this.tokenCredentials = btoa(process.env.TWITTER_CONSUMER_KEY + ':' + process.env.TWITTER_CONSUMER_SECRET);
    return this.tokenCredentials;
  },
  getBearerToken: function() {
    return new Promise(function(resolve, reject) {
      if (this.bearerToken) {
        // Don't re-query for our bearer token if we've already found it
        // and stored it in the server's memory.
        resolve(this.bearerToken);
      } else {
        if (!this.tokenCredentials) {
          this.getTokenCredentials();
        }

        // We're using Axios to make HTTP requests so that it's isomorphic
        // to the client-side app.
        var self = this;
        axios({
          method: 'post',
          url: 'https://api.twitter.com/oauth2/token',
          headers: {
            'Authorization': 'Basic ' + self.tokenCredentials,
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8.'
          },
          data: 'grant_type=client_credentials'
        })
          .then(function (response) {
            if (response.data.token_type === 'bearer') {
              self.bearerToken = response.data.access_token;
              resolve(self.bearerToken);
            } else {
              reject();
            }
          })
          .catch(function (error) {
            // Handle errors.
            reject(error);
          });
      }
    }.bind(this));
  },
  buildTwitterQuery: function(options) {
    // TODO...
  },
  searchTwitter: function(query) {
    return this.getBearerToken()
      .then(function(token) {
        return axios({
          method: 'get',
          url: 'https://api.twitter.com/1.1/search/tweets.json?q=' + query,
          headers: {
            'Authorization': 'Bearer ' + token
          }
        })
          .then(function(response) {
            // Success!
            return response.data;
          })
          .catch(function(error) {
            // Handle errors
            return error;
          });
      })
      .catch(function(error) {
        // Handle errors
        return error;
      });
  }
};