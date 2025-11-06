import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { limiter } from './middleware/rateLimit';
import { errorHandler } from './middleware/errorHandler';
import chatRouter from './routes/chat';
import imageRouter from './routes/image';
import profileRouter from './routes/profile';
import wardrobeRouter from './routes/wardrobe';
import uploadRouter from './routes/upload';

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(limiter);

app.use('/api/profile', profileRouter);
app.use('/api/wardrobe', wardrobeRouter);
app.use('/api/chat', chatRouter);
app.use('/api/image', imageRouter);
app.use('/api/upload', uploadRouter);

app.use(errorHandler);

export default app;


