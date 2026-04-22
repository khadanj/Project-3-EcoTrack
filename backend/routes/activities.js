//import express to create a router
import express from 'express';

//import ObjectId
import { ObjectId } from 'mongodb';

// import database connection
import { getDB } from '../db.js';

// import auth middleware so only logged-in users can use these routes
import isAuthenticated from '../middleware/auth.js';

//create the router
const router = express.Router();

// every activities route requires an authenticated user
router.use(isAuthenticated);

// adds new activity to database, owned by the current user
router.post('/', async (req, res) => {
  try {
    const db = getDB();
    const activity = {
      ...req.body,
      userId: new ObjectId(req.user._id),
    };
    const result = await db.collection('activities').insertOne(activity);
    res.json(result);
  } catch {
    res.status(500).json({ message: 'Error creating activity' });
  }
});

// gets only the current user's activities
router.get('/', async (req, res) => {
  try {
    const db = getDB();
    const filter = { userId: new ObjectId(req.user._id) };
    if (req.query.date) {
      filter.date = req.query.date;
    }

    // activities are returned newest first so the UI doesn't need to re-sort
    const activities = await db
      .collection('activities')
      .find(filter)
      .sort({ date: -1 })
      .toArray();

    res.json(activities);
  } catch {
    res.status(500).json({ message: 'Error fetching activities' });
  }
});

// updates one of the current user's activities
router.put('/:id', async (req, res) => {
  try {
    const db = getDB();
    const id = new ObjectId(req.params.id);
    const userId = new ObjectId(req.user._id);

    // strip any attempt to reassign ownership from the request body
    const updatedActivity = { ...req.body };
    delete updatedActivity.userId;
    delete updatedActivity._id;

    const result = await db
      .collection('activities')
      .updateOne({ _id: id, userId }, { $set: updatedActivity });

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Activity not found' });
    }
    res.json(result);
  } catch {
    res.status(500).json({ message: 'Error updating activity' });
  }
});

// deletes one of the current user's activities
router.delete('/:id', async (req, res) => {
  try {
    const db = getDB();
    const id = new ObjectId(req.params.id);
    const userId = new ObjectId(req.user._id);

    const result = await db
      .collection('activities')
      .deleteOne({ _id: id, userId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Activity not found' });
    }
    res.json(result);
  } catch {
    res.status(500).json({ message: 'Error deleting activity ' });
  }
});

// export router so index.js can use it
export default router;
