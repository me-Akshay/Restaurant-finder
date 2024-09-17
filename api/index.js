const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = 3001; //running port of server
const googleApiKey = process.env.GOOGLE_API_KEY;


const { GoogleGenerativeAI } = require('@google/generative-ai');
const { GoogleAIFileManager } = require('@google/generative-ai/server');
const multer = require('multer'); // For handling file uploads
//const upload = multer({ dest: 'uploads/' }); // Save uploaded images to 'uploads/' directory
const path = require('path');
const fs = require('fs');
const genAI = new GoogleGenerativeAI(googleApiKey);
const fileManager=new GoogleAIFileManager(googleApiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });



// MongoDB connection settings
const MONGO_URI = "mongodb://localhost:27017/";
const DB_NAME = "zomatoData";
const COLLECTION_NAME = "restaurants";


let db;

// Connect to MongoDB
MongoClient.connect(MONGO_URI, { useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to MongoDB');
    db = client.db(DB_NAME);
  })
  .catch(error => console.error('Failed to connect to MongoDB:', error));

  const cors = require('cors');
app.use(cors());
app.get('/', (req, res) => {
  res.send('Hello World!');
})



// Get Restaurant by ID

app.get('/restaurant/:restaurantId', async (req, res) => {
  console.log("Request for restaurant ID:", req.params.restaurantId);
  try {
    const restaurantId = parseInt(req.params.restaurantId);
    const restaurant = await db.collection(COLLECTION_NAME).findOne(
      { "R.res_id": restaurantId },
      { projection: {
          name: 1,
          cuisines: 1,
          featured_image: 1,
          user_rating: 1,
          average_cost_for_two: 1,
          has_online_delivery: 1,
          has_table_booking: 1,
          location: 1,
         
          id: 1,
          url: 1,
          menu_url: 1,
          photos_url: 1,
          price_range: 1
        }
      }
    );

    if (restaurant) {
      res.json(restaurant);
    } else {
      res.status(404).json({ error: "Restaurant not found" });
    }
  } catch (error) {
    console.error("Error fetching restaurant:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});



// Get List of Restaurants with pagination

app.get('/restaurants', async (req, res) => {
  console.log("got request :")
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.per_page) || 10;
    const skip = (page - 1) * perPage;

    const [restaurants, totalCount] = await Promise.all([
      db.collection(COLLECTION_NAME)
        .find()
        .project({
          name: 1,
          "R.res_id": 1,
          cuisines: 1,
          featured_image: 1,
          user_rating: 1,
          average_cost_for_two: 1,
          has_online_delivery: 1,
          has_table_booking: 1,
          location: 1
        })
        .skip(skip)
        .limit(perPage)
        .toArray(),
      db.collection(COLLECTION_NAME).countDocuments()
    ]);

    console.log(totalCount);

    // Reshape the data to match the desired output format
    const formattedRestaurants = restaurants.map(restaurant => ({
      name: restaurant.name,
      res_id: restaurant.R.res_id,
      cuisines: restaurant.cuisines,
      featured_image: restaurant.featured_image,
      user_rating: restaurant.user_rating,
      average_cost_for_two: restaurant.average_cost_for_two,
      has_online_delivery: restaurant.has_online_delivery,
      has_table_booking: restaurant.has_table_booking,
      location: restaurant.location
    }));

    res.json({
      restaurants: formattedRestaurants,
      page,
      per_page: perPage,
      total_count: totalCount,
      total_pages: Math.ceil(totalCount / perPage)
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

  //To search by location(latitude and longitude)

  app.get('/restaurants/search/location', async (req, res) => {
    const { lat, lon, range } = req.query;
  
    if (!lat || !lon || !range) {
      return res.status(400).json({ error: 'Latitude, longitude, and range are required' });
    }
  
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);
    const rangeInMeters = parseFloat(range) * 1000; // Convert km to meters
  
    if (isNaN(latitude) || isNaN(longitude) || isNaN(rangeInMeters)) {
      return res.status(400).json({ error: 'Invalid latitude, longitude, or range' });
    }
  
    try {
      const collection = db.collection(COLLECTION_NAME);
  
      const restaurants = await collection.aggregate([
        {
          $geoNear: {
            near: {
              type: 'Point',
              coordinates: [longitude, latitude]
            },
            distanceField: 'distance',
            maxDistance: rangeInMeters,
            spherical: true,
            query: {
              "location.latitude": { $exists: true },
              "location.longitude": { $exists: true }
            }
          }
        },
        {
          $project: {
            name: 1,
            "R.res_id": 1,
            featured_image: 1,
            cuisines: 1,
            "location.address": 1,
            "user_rating": 1,
            distance: 1
          }
        }
      ]).toArray();
  
      const formattedRestaurants = restaurants.map(restaurant => ({
        name: restaurant.name,
        res_id: restaurant.R.res_id,
        featured_image: restaurant.featured_image,
        cuisines: restaurant.cuisines,
        address: restaurant.location.address,
        user_rating: restaurant.user_rating,
        distance: (restaurant.distance / 1000).toFixed(2) // Convert distance to km and round to 2 decimal places
      }));
  
      res.json({ restaurants: formattedRestaurants });
    } catch (error) {
      console.error('Error searching restaurants:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  //ADVANCED SEARCH




// Updated COUNTRY_MAP
const COUNTRY_MAP = {
  "India": 1,
  "Australia": 14,
  "Brazil": 30,
  "Canada": 37,
  "Indonesia": 94,
  "New Zealand": 148,
  "Philippines": 162,
  "Qatar": 166,
  "Singapore": 184,
  "South Africa": 189,
  "Sri Lanka": 191,
  "Turkey": 208,
  "UAE": 214,
  "United Kingdom": 215,
  "United States": 216
};

app.get('/restaurants/adv', async (req, res) => {
  console.log("entry ...");
  try {
    const { 
      country, 
      minSpend,
      maxSpend,
      cuisines, 
      name,
      page = 1, 
      limit = 10 
    } = req.query;
    
    let query = {};

    if (country && COUNTRY_MAP[country]) {
      query['location.country_id'] = COUNTRY_MAP[country];
    }

    if (minSpend || maxSpend) {
      query['average_cost_for_two'] = {};
      if (minSpend) {
        query['average_cost_for_two'].$gte = parseFloat(minSpend);
      }
      if (maxSpend) {
        query['average_cost_for_two'].$lte = parseFloat(maxSpend);
      }
    }

    if (cuisines) {
      query['cuisines'] = { $regex: cuisines.split(',').map(c => c.trim()).join('|'), $options: 'i' };
    }

    if (name) {
      query['name'] = { $regex: name, $options: 'i' };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const totalRestaurants = await db.collection(COLLECTION_NAME).countDocuments(query);
    const restaurants = await db.collection(COLLECTION_NAME)
      .find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .toArray();

    const formattedRestaurants = restaurants.map(restaurant => ({
      id: restaurant.R.res_id,
      name: restaurant.name,
      cuisines: restaurant.cuisines,
      average_spend: restaurant.average_cost_for_two,
      currency: restaurant.currency,
      featured_image: restaurant.featured_image,
      user_rating: {
        aggregate_rating: restaurant.user_rating.aggregate_rating,
        rating_text: restaurant.user_rating.rating_text,
        votes: restaurant.user_rating.votes
      },
      location: {
        address: restaurant.location.address,
        locality: restaurant.location.locality,
        city: restaurant.location.city,
        latitude: restaurant.location.latitude,
        longitude: restaurant.location.longitude,
        zipcode: restaurant.location.zipcode
      },
      country: Object.keys(COUNTRY_MAP).find(key => COUNTRY_MAP[key] === restaurant.location.country_id) || 'Unknown',
      price_range: restaurant.price_range,
      has_online_delivery: restaurant.has_online_delivery,
      has_table_booking: restaurant.has_table_booking
    }));

    res.json({
      restaurants: formattedRestaurants,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalRestaurants / parseInt(limit)),
      totalResults: totalRestaurants
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
});



//Search by Image



const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({ dest: uploadDir });

app.post('/search/image', upload.single('image'), async (req, res) => {
  console.log("Route /search/image hit");
  console.log("Request body:", req.body);
  console.log("Request file:", req.file);
  try {
    // Upload the image to the Google API
    console.log(req.file.path)
    const uploadResult = await fileManager.uploadFile(req.file.path, {
      mimeType: req.file.mimetype,
      displayName: req.file.originalname,
    });

    // Use the uploaded image to classify cuisine
    const result = await model.generateContent([
      "identify the given dish as dessert , if it is dessert just return the dessert and if it is not dessert then return the cuisine which that dish belongs too [Italian, Continental,European,North Indian,South Indian, Japanese] just return the cuisine name for example if the answer is Chinese cuisine return Chinese . If possible classify the indian food as north indian or south indian else give North Indian",
      {
        fileData: {
          fileUri: uploadResult.file.uri,
          mimeType: uploadResult.file.mimeType,
        },
      },
    ]);

    const detectedCuisine = result.response.text().trim(); // Get the classified cuisine
    console.log(detectedCuisine);
    //pagination

    const page = parseInt(req.query.page) || 1;
    const limit = 9; // 3 columns * 3 rows
    const skip = (page - 1) * limit;


        // Find restaurants that serve the detected cuisine using MongoDB
        const restaurants = await db.collection(COLLECTION_NAME)
        .find({ cuisines: { $regex: detectedCuisine, $options: 'i' } })
        .project({
          name: 1,
          "R.res_id": 1,
          cuisines: 1,
          featured_image: 1,
          user_rating: 1,
          average_cost_for_two: 1,
          has_online_delivery: 1,
          has_table_booking: 1,
          location: 1
        })
        .skip(skip)
        .limit(limit)
        .toArray();
  
      const totalRestaurants = await db.collection(COLLECTION_NAME)
        .countDocuments({ cuisines: { $regex: detectedCuisine, $options: 'i' } });
  
      const totalPages = Math.ceil(totalRestaurants / limit);
  
      // Format the restaurants data
      const formattedRestaurants = restaurants.map(restaurant => ({
        name: restaurant.name,
        res_id: restaurant.R.res_id,
        cuisines: restaurant.cuisines,
        featured_image: restaurant.featured_image,
        user_rating: restaurant.user_rating,
        average_cost_for_two: restaurant.average_cost_for_two,
        has_online_delivery: restaurant.has_online_delivery,
        has_table_booking: restaurant.has_table_booking,
        location: restaurant.location
      }));

  
    // Optionally delete the uploaded file from local storage after processing
    const fs = require('fs');
    fs.unlinkSync(req.file.path); // Delete the file after processing


      // Return the found restaurants with pagination info
      res.json({
        cuisine: detectedCuisine,
        restaurants: formattedRestaurants,
        currentPage: page,
        totalPages: totalPages,
        totalRestaurants: totalRestaurants
      });

  } catch (error) {
    console.error("Error during image search:", error);
    res.status(500).json({ message: error.message });
  }
});




app.listen(port, () => {
  console.log(`Zomato API service listening at http://localhost:${port}`);
});