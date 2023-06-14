import express from 'express';
import cors from 'cors';
import { errorHandler } from './middlewares/errorHandler';
import { router } from './routes';
import { subscribeUserDeleted } from './services/consumer.service';

const app = express();

app.use(cors({ origin: true }));
app.use(express.json());
app.use('/api', router);
app.use(errorHandler());

app.listen(5002, () => console.log('Post service is running at port 5002'));

subscribeUserDeleted().then(() =>
  console.log("Subscribing 'userDeleted' exchange")
);
