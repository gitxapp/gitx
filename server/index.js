const express = require('express');
const mongoose = require('mongoose');

const bodyParser = require('body-parser');
const keys = require('./config/keys');

//Connect MongoDB
// mongoose.Promise = global.Promise;
// mongoose.connect(keys.mongoURI, {
//   keepAlive: true,
//   reconnectTries: Number.MAX_VALUE,
//   useMongoClient: true
// });

function connect() {
  const options = {
    keepAlive: 10,
    useCreateIndex: true,
    useNewUrlParser: true,
  };
  mongoose.connect(keys.mongoURI, options);
}
connect();
mongoose.connection.on('connected', () => console.log('Connected to MongoDB'));
mongoose.connection.on('error', err => console.log(err));
mongoose.connection.on('disconnected', connect);

// Initialize Mongo Models
require('./models/User');
require('./models/Note');

// Initialize Redis
// require("./services/cache");
const app = express();

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-type,Accept,x-access-token,X-Key');
  if (req.method === 'OPTIONS') {
    res.status(200).end();
  } else {
    next();
  }
});
// API Routes
app.use('/api', require('./routes/index'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port`, PORT);
});
