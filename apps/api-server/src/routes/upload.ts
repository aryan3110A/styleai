import express from 'express';
import { uploadBufferToStorage } from '../services/storage';
import { db } from '../services/firebase';
import { AuthedRequest } from '../middleware/auth';

const router = express.Router();

// Expects: { userId: string, imageBase64: string } (with or without data URL prefix)
router.post('/profile-photo', async (req: AuthedRequest, res, next) => {
  try {
    const { userId, imageBase64 } = req.body as { userId?: string; imageBase64: string };
    const uid = req.user?.uid || userId;
    if (!uid || !imageBase64) return res.status(400).json({ error: 'userId and imageBase64 are required' });

    const base64 = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;
    const buffer = Buffer.from(base64, 'base64');
    const path = `uploads/${uid}/profile-${Date.now()}.png`;
    const url = await uploadBufferToStorage(path, buffer, 'image/png');

    await db.collection('profiles').doc(uid).set({ imageUrl: url }, { merge: true });
    res.json({ success: true, url });
  } catch (err) {
    next(err);
  }
});

export default router;

// Upload wardrobe item image
router.post('/wardrobe-item', async (req: AuthedRequest, res, next) => {
  try {
    const { userId, imageBase64 } = req.body as { userId?: string; imageBase64: string };
    const uid = req.user?.uid || userId;
    if (!uid || !imageBase64) return res.status(400).json({ error: 'userId and imageBase64 are required' });

    const base64 = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;
    const buffer = Buffer.from(base64, 'base64');
    const path = `uploads/${uid}/wardrobe/${Date.now()}.png`;
    const url = await uploadBufferToStorage(path, buffer, 'image/png');
    res.json({ success: true, url });
  } catch (err) {
    next(err);
  }
});


