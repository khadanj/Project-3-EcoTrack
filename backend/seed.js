// adds fake data to database
// runs with: node seed.js

import { MongoClient } from 'mongodb';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';
dotenv.config();

const DEMO_EMAIL = 'demo@ecotrack.com';
const DEMO_PASSWORD = 'demo1234';
const DEMO_NAME = 'Demo User';

//read files from data folder and extracts contents
const transportData = JSON.parse(
  readFileSync('./data/transport.json', 'utf-8'),
);
const dietData = JSON.parse(readFileSync('./data/diet.json', 'utf-8'));
const energyData = JSON.parse(readFileSync('./data/energy.json', 'utf-8'));
const goalsData = JSON.parse(readFileSync('./data/goals.json', 'utf-8'));

//connect to mongodb
const client = new MongoClient(process.env.MONGO_URI);
await client.connect();
const db = client.db('ecotrack');

// upsert the demo user so everything seeded can be attributed to them
let demoUser = await db.collection('users').findOne({ email: DEMO_EMAIL });
if (!demoUser) {
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);
  const result = await db.collection('users').insertOne({
    name: DEMO_NAME,
    email: DEMO_EMAIL,
    passwordHash,
    createdAt: new Date(),
  });
  demoUser = { _id: result.insertedId };
  console.log('created demo user:', DEMO_EMAIL);
} else {
  console.log('demo user already exists:', DEMO_EMAIL);
}

const demoUserId = demoUser._id;

//delete old data so there are no duplicates
await db
  .collection('activities')
  .drop()
  .catch(() => {
    console.log('activities collection does not exist yet');
  });

//combine all three files and tag every record with the demo userId
const allActivities = [...transportData, ...dietData, ...energyData].map(
  (activity) => ({ ...activity, userId: demoUserId }),
);

//insert everything into activities collection
await db.collection('activities').insertMany(allActivities);
console.log('inserted ' + allActivities.length + ' activities!');

//delete old goals data so there are no duplicates
await db
  .collection('goals')
  .drop()
  .catch(() => {
    console.log('goals collection does not exist yet');
  });

const allGoals = goalsData.map((goal) => ({ ...goal, userId: demoUserId }));

//insert goals into goals collection
await db.collection('goals').insertMany(allGoals);
console.log('inserted ' + allGoals.length + ' goals!');

// disconnect from mongodb
await client.close();
