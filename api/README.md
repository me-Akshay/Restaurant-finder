# Zomato Data Backend

This is the backend for the Zomato Data project. It loads restaurant data into a MongoDB database, sets up geolocation capabilities, and provides several API endpoints for interacting with the data.

## Tech Stack

- Node.js
- Express.js
- MongoDB

## Setup and Usage

### 1. Data Load

- Use `load_data.py` to load restaurant data into MongoDB.
- The data is stored in a database named `zomatoData`.

### 2. Create 2D Sphere for Geolocation

- Run `updateGeoJson.js` to create a 2D sphere index in the MongoDB database. This is used for finding restaurants by latitude and longitude.

### 3. Start the Backend Server

- Run `index.js` to start the backend server.

```bash
node index.js

## API Endpoints

### 1. Get Restaurant by ID

- **Endpoint:** `/api/restaurant/:id`
- **Method:** `GET`
- **Description:** Retrieves a restaurant's details using its unique ID.

### 2. Get List of Restaurants with Pagination

- **Endpoint:** `/api/restaurants`
- **Method:** `GET`
- **Description:** Retrieves a paginated list of restaurants.
- **Query Parameters:**
  - `page` (optional): Page number for pagination.
  - `limit` (optional): Number of results per page.

### 3. Search by Location (Latitude and Longitude)

- **Endpoint:** `/api/restaurants/location`
- **Method:** `GET`
- **Description:** Finds restaurants based on geographical coordinates (latitude and longitude).
- **Query Parameters:**
  - `lat`: Latitude of the location.
  - `lng`: Longitude of the location.

### 4. Advanced Search

- **Endpoint:** `/api/restaurants/advanced-search`
- **Method:** `POST`
- **Description:** Allows complex search operations based on multiple criteria (e.g., cuisines, average cost).

### 5. Search by Image

- **Endpoint:** `/api/restaurants/search-by-image`
- **Method:** `POST`
- **Description:** Upload an image to search for restaurants offering cuisines similar to the image.


