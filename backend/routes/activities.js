//import express to create a router
import express from 'express';

//import ObjectId
import { ObjectId } from 'mongodb';

// import database connection
import { getDB } from '../db.js';

//create the router
const router = express.Router();

// adds new activity to database
router.post('/', async (req, res) => {
  try {
    const db = getDB();
    const activity = req.body;
    const result = await db.collection('activities').insertOne(activity);
    res.json(result);
  } catch {
    res.status(500).json({ message: 'Error creating activity' });
  }
});

// gets all activities
router.get('/', async (req, res) => {
  try {
    const db = getDB();
    const filter = {};
    if (req.query.date) {
      filter.date = req.query.date;
    }

    // get activities from database
    const activities = await db.collection('activities').find(filter).toArray();

    res.json(activities);
  } catch {
    res.status(500).json({ message: 'Error fetching activities' });
  }
});

//updates one activity by its id
router.put('/:id', async (req, res) => {
  try {
    const db = getDB();

    //convert the id from a string to mongodb ObjectId
    const id = new ObjectId(req.params.id);
    const updatedActivity = req.body;

    const result = await db
      .collection('activities')
      .updateOne({ _id: id }, { $set: updatedActivity });
    res.json(result);
  } catch {
    res.status(500).json({ message: 'Error updating activity' });
  }
});

// deletes activity by its id
router.delete('/:id', async (req, res) => {
  try {
    const db = getDB();

    //converts id from a string to mongodb ObjectId
    const id = new ObjectId(req.params.id);

    const result = await db.collection('activities').deleteOne({ _id: id });
    res.json(result);
  } catch {
    res.status(500).json({ message: 'Error deleting activity ' });
  }
});

// export router so index.js can use it
export default router;
