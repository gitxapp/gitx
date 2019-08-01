import express from 'express';
import cors from 'cors';
import { connect as _connect, connection } from 'mongoose';

import { json, urlencoded } from 'body-parser';
import { mongoURI } from './config/keys';

function connect() {
  const options = {
    keepAlive: 10,
    useCreateIndex: true,
    useNewUrlParser: true,
  };
  _connect(mongoURI, options);
}
connect();
connection.on('connected', () => console.log('Connected to MongoDB'));
connection.on('error', err => console.log(err));
connection.on('disconnected', connect);

// Initialize Redis
// require("./services/cache");
const app = express();

// app.use(static(`${__dirname}/public`));

app.use(json());
app.use(urlencoded({ extended: true }));

app.use(
  cors({
    origin: '*',
    credentials: true,
  }),
);
// API Routes
app.use('/api', require('./routes/index'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('Server started on port', PORT);
});
