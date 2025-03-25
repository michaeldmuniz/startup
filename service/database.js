const { MongoClient, ObjectId } = require('mongodb');
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
  try {
    if (typeof item.sellerId === 'string') {
      item.sellerId = new ObjectId(item.sellerId);
    }
    const result = await itemCollection.insertOne(item);
    return { ...item, _id: result.insertedId };
  } catch (error) {
    console.error('Error adding item:', error);
    throw error;
  }
}

async function getItems() {
  try {
    const items = await itemCollection.find().toArray();
    // Get seller emails for all items
    const itemsWithSellerInfo = await Promise.all(items.map(async (item) => {
      const seller = await userCollection.findOne({ _id: new ObjectId(item.sellerId) });
      return {
        ...item,
        sellerEmail: seller ? seller.email : 'Unknown Seller'
      };
    }));
    return itemsWithSellerInfo;
  } catch (error) {
    console.error('Error getting items:', error);
    throw error;
  }
}

async function getItemsByUser(userId) {
  try {
    const query = { sellerId: new ObjectId(userId) };
    return await itemCollection.find(query).toArray();
  } catch (error) {
    console.error('Error getting items by user:', error);
    throw error;
  }
}

async function deleteItem(itemId, userId) {
  try {
    const result = await itemCollection.deleteOne({ 
      _id: new ObjectId(itemId),
      sellerId: new ObjectId(userId)
    });
    return result.deletedCount > 0;
  } catch (error) {
    console.error('Error deleting item:', error);
    throw error;
  }
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