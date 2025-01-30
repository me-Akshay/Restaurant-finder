# TastyFind | MERN Stack, Google GenAI

TastyFind is a full-stack, high-performance restaurant finder application built using the MERN stack and Zomato data. The platform enables users to effortlessly discover restaurants through various search methods, including text-based, location-based, and image-based search powered by Google Generative AI.

## Features

- **Image-Based Search:** Utilize Google GenAI to search for restaurants based on food images.
- **Advanced Filtering:** Filter restaurants by country, name, cuisine, and price range.
- **Location-Based Search:** Find restaurants near a specific location using geolocation services.
- **Pagination & Performance Optimization:** Efficiently retrieve and display data with pagination techniques.

## Tech Stack

- **Frontend:** React.js
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **API Integration:** Google Generative AI
- **Authentication:** JWT-based authentication

## Installation

### Setup
```bash
# Clone the repository
git clone https://github.com/yourusername/TastyFind.git
cd TastyFind

# Install dependencies
npm install

# Start the backend server
cd api
nodemon index.js

# Start the frontend application
cd client
cd my-app
npm start
```

## Workflow

### 1. Landing Page
![Landing Page](https://github.com/user-attachments/assets/dd9e4684-8ed4-4ccb-98e9-263b37ac7564)

### 2. Restaurant Details Page
![Restaurant Details](https://github.com/user-attachments/assets/570b8a05-9376-4880-8e19-97c24289b34d)

### 3. Location-Based Search
![Location Search](https://github.com/user-attachments/assets/0b5a10cf-ad40-4f38-bf27-d3b1836d5377)

#### 3.1 Results after entering the location
![Search Results](https://github.com/user-attachments/assets/2eeeea1f-8cef-436e-aa11-3d7d653999ed)

### 4. Image-Based Search
![Image Search](https://github.com/user-attachments/assets/37fdd160-8f2a-4716-bc7a-0855bea6a29b)

### 5. Advanced Search (Country, Restaurant Name, Min & Max Spend)
![Advanced Search](https://github.com/user-attachments/assets/626cef1f-2099-4c52-88e4-0ab4705dd4a1)

## Data Loading

Data is loaded using the `load_data.py` script, which imports restaurant data from JSON files into a MongoDB database named `zomatoData`.

## API Endpoints

### Get Restaurant by ID
Retrieve details of a specific restaurant by its ID.
```http
GET /restaurant/:restaurantId
```
```javascript
app.get('/restaurant/:restaurantId', (req, res) => {
  // Implementation to retrieve restaurant by ID
});
```

### Get List of Restaurants
Fetch a list of restaurants with pagination support.
```http
GET /restaurants
```
```javascript
app.get('/restaurants', (req, res) => {
  // Implementation to retrieve a list of restaurants
});
```

## User Interface

### Restaurant List Page
- Displays a list of restaurants retrieved from MongoDB.
- Implemented pagination for optimized data retrieval.

### Restaurant Detail Page
- Shows restaurant details, including cuisine, pricing, and ratings.
- Data is fetched from the backend using API calls.

### Location Search
- Users can search for restaurants near a specific location.
- Uses latitude and longitude for geolocation-based filtering.

### Image Search
- Google GenAI-powered image recognition maps food images to cuisines.
- Uses mapped cuisine data to find relevant restaurants.

### Filtering Options
- **By Country:** Filter restaurants by country.
- **By Average Spend:** Filter based on the average spend for two people.
- **By Cuisines:** Select cuisine preferences for targeted restaurant searches.

## Contact
For queries or contributions, reach out at [akshay21454@example.com](mailto:akshay21454@example.com).
