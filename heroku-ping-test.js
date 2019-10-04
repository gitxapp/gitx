const http = require('http');

console.log('Heroku ping test started');

function startKeepAlive() {
  setInterval(() => {
    const options = {
      host: process.env.HEROKU_URL,
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
  }, 20 * 60 * 1000); // load every 20 minutes
}
startKeepAlive();
