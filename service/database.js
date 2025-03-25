const { MongoClient } = require('mongodb');
const config = require('./dbConfig.json');

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);
const db = client.db('thriftconnect');
const userCollection = db.collection('users');
const itemCollection = db.collection('items');

// Test the connection
(async function testConnection() {
  try {
    await db.command({ ping: 1 });
    console.log('Connected successfully to MongoDB');
  } catch (ex) {
    console.log(`Unable to connect to database with ${url} because ${ex.message}`);
    process.exit(1);
  }
})();

// User functions
function getUser(email) {
  return userCollection.findOne({ email: email });
}

function getUserByToken(token) {
  return userCollection.findOne({ token: token });
}

async function addUser(user) {
  await userCollection.insertOne(user);
}

async function updateUser(user) {
  await userCollection.updateOne({ email: user.email }, { $set: user });
}

// Item functions
async function addItem(item) {
  return itemCollection.insertOne(item);
}

async function getItems() {
  return itemCollection.find().toArray();
}

async function getItemsByUser(userId) {
  return itemCollection.find({ sellerId: userId }).toArray();
}

async function deleteItem(itemId, userId) {
  const result = await itemCollection.deleteOne({ 
    _id: itemId,
    sellerId: userId 
  });
  return result.deletedCount > 0;
}

module.exports = {
  getUser,
  getUserByToken,
  addUser,
  updateUser,
  addItem,
  getItems,
  getItemsByUser,
  deleteItem,
}; 