/* eslint-disable no-console */
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import ejs from 'ejs';

import { json, urlencoded } from 'body-parser';
import routes from './routes';
import validateRequest from './middlewares/validateRequest';

dotenv.config();

function connect() {
  const options = {
    keepAlive: 10,
    useCreateIndex: true,
    useNewUrlParser: true,
  };
  mongoose.connect(process.env.DB_URI, options);
}
connect();
mongoose.connection.on('connected', () => console.log('Connected to MongoDB'));
mongoose.connection.on('error', err => console.log(err));
mongoose.connection.on('disconnected', connect);

// Initialize Redis
// require("./services/cache");
const app = express();

app.use(express.static(`${__dirname}/public`));
app.set('views', `${__dirname}/public`);
app.engine('html', ejs.renderFile);

app.set('view engine', 'html');
app.use(json());
app.use(urlencoded({ extended: true }));

app.use(
  cors({
    origin: '*',
    credentials: true,
  }),
);
app.get('/', (req, res) => {
  res.send({
    message: 'App is working',
  });
});
// eslint-disable-next-line global-require
app.all('/api/*', validateRequest);

// API Routes
app.use('/api/v1', routes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('Server started on port', PORT);
});
