import express from 'express';
import { db } from '../services/firebase';
import { AuthedRequest } from '../middleware/auth';
import { callChat } from '../services/openai';
import { buildMessages } from '../services/promptBuilder';
import { tryParseJsonFromMarkdown } from '../utils/parser';

const router = express.Router();

router.post('/', async (req: AuthedRequest, res, next) => {
  try {
    const { userId, message } = req.body as { userId?: string; message: string };
    const uid = req.user?.uid || userId;
    if (!uid || !message) return res.status(400).json({ error: 'userId and message are required' });

    const profileDoc = await db.collection('profiles').doc(uid).get();
    if (!profileDoc.exists) return res.status(404).json({ error: 'Profile not found' });

    const profile = profileDoc.data() as any;
    const messages = buildMessages(profile, message);
    const raw = await callChat(messages);
    const parsed = tryParseJsonFromMarkdown(raw);

    await db.collection('profiles').doc(uid).collection('chats').add({
      message,
      response: parsed,
      timestamp: new Date(),
    });

    res.json(parsed);
  } catch (err) {
    next(err);
  }
});

router.get('/:userId?', async (req: AuthedRequest, res, next) => {
  try {
    const userId = req.params.userId || req.user?.uid;
    if (!userId) return res.status(400).json({ error: 'userId is required' });
    const snapshot = await db
      .collection('profiles')
      .doc(userId)
      .collection('chats')
      .orderBy('timestamp', 'desc')
      .limit(50)
      .get();
    const chats = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    res.json({ chats });
  } catch (err) {
    next(err);
  }
});

export default router;


