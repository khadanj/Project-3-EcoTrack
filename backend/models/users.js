// this file handles storing and finding users in database
import { getDB } from '../db.js';
import { ObjectId } from 'mongodb';

// save a new user
async function createUser(name, email, passwordHash) {
  const db = getDB();

  // this is the object that going to store in the database
  const newUser = {
    name: name,
    email: email,
    // store hashed password not real one
    passwordHash: passwordHash,
    createdAt: new Date(),
  };

  const result = await db.collection('users').insertOne(newUser);
  return result;
}

// find a user by email address
async function findUserByEmail(email) {
  const db = getDB();
  const user = await db.collection('users').findOne({ email: email });
  return user;
}

// find a user by id
async function findUserById(id) {
  const db = getDB();
  const objectId = new ObjectId(id);
  const user = await db.collection('users').findOne({ _id: objectId });
  return user;
}

export { createUser, findUserByEmail, findUserById };
