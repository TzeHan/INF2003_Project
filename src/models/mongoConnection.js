const { MongoClient } = require('mongodb');

const uri = "mongodb://127.0.0.1:27017"; 
const client = new MongoClient(uri);

let db;

async function connectToMongo() {
    if (db) return db; 

    try {
        await client.connect();
        console.log("Connected to MongoDB!");
        
        db = client.db('movies'); 
        return db;
    } catch (err) {
        console.error("MongoDB connection failed:", err);
        throw err;
    }
}

module.exports = { connectToMongo };