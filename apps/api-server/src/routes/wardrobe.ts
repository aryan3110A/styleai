import express from 'express';
import { db } from '../services/firebase';
import { AuthedRequest } from '../middleware/auth';
import { v4 as uuidv4 } from 'uuid';
import { WardrobeItem } from '../types';

const router = express.Router();

router.post('/', async (req: AuthedRequest, res, next) => {
  try {
    const { userId, item } = req.body as { userId?: string; item: Partial<WardrobeItem> };
    const uid = req.user?.uid || userId;
    if (!uid) return res.status(400).json({ error: 'userId is required' });
    if (!item?.name || !item?.category) return res.status(400).json({ error: 'item.name and item.category are required' });
    const id = (item as WardrobeItem).id || uuidv4();
    const data: WardrobeItem = { id, name: item.name!, category: item.category!, imageUrl: item.imageUrl };
    await db.collection('profiles').doc(uid).collection('wardrobe').doc(id).set(data);
    res.json({ success: true, item: data });
  } catch (err) {
    next(err);
  }
});

router.get('/:userId?', async (req: AuthedRequest, res, next) => {
  try {
    const uid = req.params.userId || req.user?.uid;
    if (!uid) return res.status(400).json({ error: 'userId is required' });
    const snapshot = await db.collection('profiles').doc(uid).collection('wardrobe').get();
    const items = snapshot.docs.map((doc) => doc.data());
    res.json({ items });
  } catch (err) {
    next(err);
  }
});

router.delete('/:userId?/:itemId', async (req: AuthedRequest, res, next) => {
  try {
    const itemId = req.params.itemId;
    const uid = req.params.userId || req.user?.uid;
    if (!uid) return res.status(400).json({ error: 'userId is required' });
    await db.collection('profiles').doc(uid).collection('wardrobe').doc(itemId).delete();
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

export default router;


