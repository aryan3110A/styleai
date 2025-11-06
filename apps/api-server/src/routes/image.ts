import express from 'express';
import fetch from 'node-fetch';
import { generateImage } from '../services/openai';
import { AuthedRequest } from '../middleware/auth';
import { uploadBufferToStorage } from '../services/storage';

const router = express.Router();

router.post('/', async (req: AuthedRequest, res, next) => {
  try {
    const { userId, prompt } = req.body as { userId?: string; prompt: string };
    const uid = req.user?.uid || userId;
    if (!uid || !prompt) return res.status(400).json({ error: 'userId and prompt are required' });

    const url = await generateImage(prompt);
    if (!url) return res.status(500).json({ error: 'Failed to generate image' });

    const response = await fetch(url);
    const buffer = await (response as any).buffer();
    const path = `generated/${uid}/${Date.now()}.png`;
    const publicUrl = await uploadBufferToStorage(path, buffer, 'image/png');

    res.json({ url: publicUrl });
  } catch (err) {
    next(err);
  }
});

export default router;


