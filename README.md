## MLH Localhost Tweet Scraper (backend)

[Node.js](https://nodejs.org/en/)/[Express](http://expressjs.com/) app that queries the [Twitter Search API](https://developer.twitter.com/en/docs/tweets/search/api-reference/get-search-tweets) for Tweets about MLH Localhost. It returns the queried data at the `/tweets` endpoint.

### Setup

##### Get the application code 

1. Clone this repository to your local machine:

    `git clone git@github.com:petestreet/mlh-localhost-sample-node.git`

2. Open the project directory:

    `cd mlh-localhost-sample-node`

##### Credentials

Since this application accesses the Twitter API, you'll need Twitter-supplied credentials:

1. Make a file at the root of your project directory called `.env`. Never make this file public or track it with git.

2. Go to [https://apps.twitter.com](https://apps.twitter.com) and create a new app (it should be "Read-only").

3. Fill in the input fields, then go to the `Keys and Access Tokens` tab.

4. In your `.env` file, add two lines: one with `TWITTER_CONSUMER_KEY=your_consumer_key` and the other with `TWITTER_CONSUMER_SECRET=your_consumer_secret`. Again, never make these values public.

##### Running the app
    
1. Install packages:

    `npm install`
    
2. Start the server:

    `npm run start`
    
By default, this will run on [localhost:3001](http://localhost:3001), so open that port in your browser. If you see a "Hello World!" message, then the Node.js server is running properly.

I've set up some basic [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) rules at the top of `app.js`, which means you'll only be able to access the `/tweets` endpoint via an approved host. Feel free to change the hosts in the `localWhitelist` array to match the localhost port that your local frontend app is running on.

### Twitter API Authorization

The most complicated part of this app is in the Twitter API helper functions. We first send our application credentials to Twitter's `oauth2/token` endpoint and receive a bearer token back. 

Then, to avoid making the request for a bearer token every time our application is accessed, we store the bearer token in the server's memory. We can then use that token in the `Authorization` header for every subsequent request to Twitter's Search API.

Check out the documentation on [application authorization](https://developer.twitter.com/en/docs/basics/authentication/overview/application-only).

### More details

Once we have a valid bearer token stored in memory, we send it along with every request we make when the `/tweets` endpoint is hit. The `buildTwitterQuery` function builds a basic search query that includes the terms `mlhlocalhost` and `#mlhlocalhost`. Feel free to extend this function to search a broader or more specific set of terms. 

The `searchTwitter` function uses the [Axios](https://github.com/axios/axios) library to make the actual HTTP request, and returns a Promise whose result gets rendered from the server as JSON. 

The top half of `app.js` includes some basic setup and security features for Express, and the bottom half includes the app's endpoints. 

### Deployment

This application is hosted on [Heroku](https://www.heroku.com), but you're free to use any [Node.js host](https://www.google.com/search?q=nodejs+hosts). Make sure to add the ENV variables that you put in `.env` to your server instance.

### License

This project is licensed under the MIT License - see the [LICENSE.md](https://github.com/petestreet/mlh-localhost-sample-node/blob/master/LICENSE.md) file for details