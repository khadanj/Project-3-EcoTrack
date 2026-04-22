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

// every goals route requires an authenticated user
router.use(isAuthenticated);

// adds new goal to database, owned by the current user
router.post('/', async (req, res) => {
  try {
    const db = getDB();
    const goal = {
      ...req.body,
      userId: new ObjectId(req.user._id),
    };
    const result = await db.collection('goals').insertOne(goal);
    res.json(result);
  } catch {
    res.status(500).json({ message: 'Error creating goal' });
  }
});

// gets only the current user's goals
router.get('/', async (req, res) => {
  try {
    const db = getDB();
    const filter = { userId: new ObjectId(req.user._id) };
    if (req.query.status) {
      filter.status = req.query.status;
    }

    const goals = await db.collection('goals').find(filter).toArray();

    res.json(goals);
  } catch {
    res.status(500).json({ message: 'Error fetching goals' });
  }
});

// updates one of the current user's goals
router.put('/:id', async (req, res) => {
  try {
    const db = getDB();
    const id = new ObjectId(req.params.id);
    const userId = new ObjectId(req.user._id);

    const updatedGoal = { ...req.body };
    delete updatedGoal.userId;
    delete updatedGoal._id;

    const result = await db
      .collection('goals')
      .updateOne({ _id: id, userId }, { $set: updatedGoal });

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    res.json(result);
  } catch {
    res.status(500).json({ message: 'Error updating goal' });
  }
});

// deletes one of the current user's goals
router.delete('/:id', async (req, res) => {
  try {
    const db = getDB();
    const id = new ObjectId(req.params.id);
    const userId = new ObjectId(req.user._id);

    const result = await db.collection('goals').deleteOne({ _id: id, userId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    res.json(result);
  } catch {
    res.status(500).json({ message: 'Error deleting goal' });
  }
});

// export router so index.js can use it
export default router;
