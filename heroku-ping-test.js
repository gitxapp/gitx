const http = require('http');

const HEROKU_URL = 'gitextended.herokuapp.com';

function startKeepAlive() {
  setInterval(() => {
    const options = {
      host: HEROKU_URL,
      port: 80,
      path: '/',
    };
    http
      .get(options, res => {
        res.on('data', chunk => {
          try {
            // optional logging... disable after it's working
            console.log(`HEROKU RESPONSE: ${chunk}`);
          } catch (err) {
            console.log(err.message);
          }
        });
      })
      .on('error', err => {
        console.log(`Error: ${err.message}`);
      });
  }, 1 * 60 * 1000); // load every 20 minutes
}
startKeepAlive();
