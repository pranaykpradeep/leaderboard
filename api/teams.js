import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI; // Set this in Vercel dashboard
const dbName = 'leaderboard'; // You can change this
const collectionName = 'teams';

let cachedClient = null;

async function connectToDatabase() {
  if (cachedClient) return cachedClient;
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  cachedClient = client;
  return client;
}

export default async function handler(req, res) {
  const client = await connectToDatabase();
  const db = client.db(dbName);
  const collection = db.collection(collectionName);

  if (req.method === 'GET') {
    const teams = await collection.find({}).toArray();
    res.status(200).json(teams);
  } else if (req.method === 'PUT') {
    const teams = req.body;
    await collection.deleteMany({});
    await collection.insertMany(teams);
    res.status(200).json({ success: true });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
