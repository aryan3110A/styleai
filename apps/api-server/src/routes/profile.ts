import express from 'express';
import { db } from '../services/firebase';
import { AuthedRequest } from '../middleware/auth';
import { requireAuth } from '../middleware/requireAuth';
import { UserProfile } from '../types';

const router = express.Router();

// Create or update the authenticated user's profile. Requires auth and writes
// to the Firebase UID doc. Ensures email is saved on the profile.
router.post('/', requireAuth, async (req: AuthedRequest, res, next) => {
  try {
    const profile = req.body as Partial<UserProfile>;
    const uid = req.user!.uid;
    const email = (req.user as any)?.email || (profile as any)?.email;
    if (!email) {
      return res.status(400).json({ error: 'Email is required on profile' });
    }
    const data: UserProfile = {
      userId: uid,
      email,
      name: profile.name,
      age: profile.age,
      gender: profile.gender,
      heightRange: profile.heightRange,
      bodyType: profile.bodyType,
      skinTone: profile.skinTone,
      favouriteColours: profile.favouriteColours,
      region: profile.region,
      languagePref: profile.languagePref,
      imageUrl: profile.imageUrl,
    };
    // Firestore rejects undefined fields. Remove any keys that are undefined
    // so callers can omit optional values without errors.
    const cleaned = Object.fromEntries(
      Object.entries(data).filter(([, v]) => v !== undefined)
    ) as UserProfile;
    await db.collection('profiles').doc(uid).set(cleaned, { merge: true });
    res.json({ success: true, profile: cleaned });
  } catch (err) {
    next(err);
  }
});

router.get('/:userId?', async (req: AuthedRequest, res, next) => {
  try {
    const userId = req.params.userId || req.user?.uid;
    if (!userId) return res.status(400).json({ error: 'userId is required' });
    const doc = await db.collection('profiles').doc(userId).get();
    res.json(doc.exists ? doc.data() : { error: 'Profile not found' });
  } catch (err) {
    next(err);
  }
});

export default router;


