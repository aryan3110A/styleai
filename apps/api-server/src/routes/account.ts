import express from 'express';
import { db } from '../services/firebase';
import { AuthedRequest } from '../middleware/auth';
import { requireAuth } from '../middleware/requireAuth';

const router = express.Router();

// Link a legacy local user id (e.g. user_xxxxx) into the authenticated Firebase UID.
// This copies the profile document and common subcollections (wardrobe, chats)
// from the old id into the authenticated user's doc. Optionally deletes the
// old data if `deleteOld` is true.
router.post('/link', requireAuth, async (req: AuthedRequest, res, next) => {
  try {
    const uid = req.user!.uid;
    const { oldUserId, deleteOld } = req.body as { oldUserId?: string; deleteOld?: boolean };
    if (!oldUserId) return res.status(400).json({ error: 'oldUserId is required' });
    if (oldUserId === uid) return res.json({ success: true, message: 'Already linked' });

    const srcDocRef = db.collection('profiles').doc(oldUserId);
    const dstDocRef = db.collection('profiles').doc(uid);

    const srcDoc = await srcDocRef.get();
    if (srcDoc.exists) {
      // Copy profile fields (merge into existing)
      await dstDocRef.set(srcDoc.data() || {}, { merge: true });
    }

    // Copy common subcollections
    const collectionsToCopy = ['wardrobe', 'chats'];
    for (const col of collectionsToCopy) {
      const snap = await srcDocRef.collection(col).get();
      for (const d of snap.docs) {
        await dstDocRef.collection(col).doc(d.id).set(d.data());
      }
    }

    if (deleteOld) {
      // Delete copied docs from old location
      for (const col of collectionsToCopy) {
        const snap = await srcDocRef.collection(col).get();
        for (const d of snap.docs) {
          await srcDocRef.collection(col).doc(d.id).delete();
        }
      }
      await srcDocRef.delete();
    }

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

export default router;
