import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { errorHandler } from './middlewares/errorHandler';
import { routes } from './routes/index.route';

const app = express();

app.use(cors({ origin: true }));
app.use(cookieParser());
app.use(express.json());
app.use('/api', routes);
app.use(errorHandler());

app.listen(5001, () => console.log('User service is running at port 5001'));
