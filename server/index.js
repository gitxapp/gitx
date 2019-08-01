import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

import { json, urlencoded } from 'body-parser';
import { mongoURI } from './config/keys';
import routes from './routes';

function connect() {
  const options = {
    keepAlive: 10,
    useCreateIndex: true,
    useNewUrlParser: true,
  };
  mongoose.connect(mongoURI, options);
}
connect();
mongoose.connection.on('connected', () => console.log('Connected to MongoDB'));
mongoose.connection.on('error', err => console.log(err));
mongoose.connection.on('disconnected', connect);

// Initialize Redis
// require("./services/cache");
const app = express();

app.use(express.static(`${__dirname}/public`));

app.use(json());
app.use(urlencoded({ extended: true }));

app.use(
  cors({
    origin: '*',
    credentials: true,
  }),
);
// API Routes
app.use('/api/v1', routes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('Server started on port', PORT);
});
