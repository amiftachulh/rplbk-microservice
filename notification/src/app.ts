import express from 'express';
import cors from 'cors';
import { errorHandler } from './middlewares/errorHandler';
import { router } from './routes';
import { consumeMessage } from './services/consumer.service';

const app = express();

app.use(cors({ origin: true }));
app.use(express.json());
app.use('/api', router);
app.use(errorHandler());

app.listen(5004, () =>
  console.log('Notification service is running at port 5004')
);

const queues = ['follow', 'postLike', 'comment'];
queues.forEach((queue) => {
  consumeMessage(queue).then(() => console.log(`Consuming '${queue}' queue`));
});
