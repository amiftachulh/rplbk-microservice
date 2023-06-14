import express from 'express';
import cors from 'cors';
import { errorHandler } from './middlewares/errorHandler';
import { router } from './routes';
import {
  consumePostDeleted,
  subscribeUserDeleted,
} from './services/consumer.service';

const app = express();

app.use(cors({ origin: true }));
app.use(express.json());
app.use('/api', router);
app.use(errorHandler());

app.listen(5003, () => console.log('Comment service is running at port 5003'));

consumePostDeleted('postDeleted').then(() =>
  console.log("Consuming 'postDeleted' queue")
);

subscribeUserDeleted().then(() =>
  console.log("Subscribing 'userDeleted' exchange")
);
