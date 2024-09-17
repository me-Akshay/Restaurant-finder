const { MongoClient } = require('mongodb');

const MONGO_URI = "mongodb://localhost:27017/";
const DB_NAME = "zomatoData";
const COLLECTION_NAME = "restaurants";

async function updateToGeoJSON() {
  let client;

  try {
    client = await MongoClient.connect(MONGO_URI, { useUnifiedTopology: true });
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    // Update documents to include GeoJSON Point
    const updateResult = await collection.updateMany(
      { "location.latitude": { $exists: true }, "location.longitude": { $exists: true } },
      [
        {
          $set: {
            location: {
              type: "Point",
              coordinates: [
                { $toDouble: "$location.longitude" },
                { $toDouble: "$location.latitude" }
              ]
            }
          }
        }
      ]
    );

    console.log(`${updateResult.modifiedCount} documents updated to include GeoJSON Point`);

    // Create 2dsphere index
    await collection.createIndex({ "location": "2dsphere" });
    console.log("2dsphere index created on location field");

  } catch (error) {
    console.error('Error updating documents:', error);
  } finally {
    if (client) {
      await client.close();
    }
  }
}

updateToGeoJSON();