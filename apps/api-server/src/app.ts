import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { limiter } from './middleware/rateLimit';
import { errorHandler } from './middleware/errorHandler';
import { authenticate } from './middleware/auth';
import { requireAuth } from './middleware/requireAuth';
import chatRouter from './routes/chat';
import imageRouter from './routes/image';
import profileRouter from './routes/profile';
import wardrobeRouter from './routes/wardrobe';
import accountRouter from './routes/account';
import uploadRouter from './routes/upload';

const app = express();
// When running behind proxies or in some deployment environments, the
// client IP is provided via the X-Forwarded-For header. Enable trust proxy
// so Express populates req.ip from that header when present. This prevents
// some rate-limiters from seeing an undefined ip value.
app.set('trust proxy', true);
app.use(cors());

// Parse JSON bodies
app.use(bodyParser.json({ limit: '10mb' }));
// Attach optional authenticated user (if Authorization header present)
app.use(authenticate);
app.use(limiter);

// Public profile read is allowed; saving profile requires auth (handled in router)
app.use('/api/profile', profileRouter);

// Wardrobe routes: reading is allowed, writes are protected inside router via requireAuth
app.use('/api/wardrobe', wardrobeRouter);

// Chat routes: creating/appending/deleting chats require auth (enforced in router)
app.use('/api/chat', chatRouter);

app.use('/api/image', imageRouter);
app.use('/api/upload', uploadRouter);

// Account linking endpoint - used to migrate legacy local user ids into the
// authenticated Firebase UID (copies profile, wardrobe, chats)
app.use('/api/account', accountRouter);

app.use(errorHandler);

export default app;


