## Data Loading

Data loading is handled by the `load_data.py` script. This script imports data from all JSON files into a single database named `zomatoData` on MongoDB.

## Web API Service

Developed a web API service with the following endpoints to serve the content loaded in the previous step:

- **Get Restaurant by ID**: Retrieve details of a specific restaurant by its ID.
  - **Endpoint**: `GET /restaurant/:restaurantId`
  - **Handler**: 
    ```javascript
    app.get('/restaurant/:restaurantId', (req, res) => {
      // Implementation to retrieve restaurant by ID
    });
    ```

- **Get List of Restaurants**: Fetch a list of restaurants with pagination support.
  - **Endpoint**: `GET /restaurants`
  - **Handler**: 
    ```javascript
    app.get('/restaurants', (req, res) => {
      // Implementation to retrieve a list of restaurants
    });
    ```

## User Interface

The frontend application includes the following components and features:

- **Restaurant List Page**: 
  - Created a `RestaurantList` component to display a list of restaurants.
  - Data is fetched from the backend where it is stored in MongoDB.

- **Restaurant Detail Page**: 
  - Developed a `RestaurantDetail` component to show details of a specific restaurant.
  - Data is retrieved from the backend.

- **Location Search**:
  - Created a `LocationSearch` component.
  - Implemented 2D sphere coordinates for geolocation analysis using latitude and longitude.

- **Image Search**:
  - Utilized generative AI to identify food items from images.
  - Mapped identified food to cuisines and used this information to find restaurants.

- **Filtering Options**:
  - **By Country**: Filter restaurants based on country.
  - **By Average Spend for Two People**:
  - Filter restaurants based on the average cost for two people.
  - Users provide minimum and maximum values for the average spend.
  - The application filters and returns restaurants where the average spend falls within the specified range.

  - **By Cuisines**: Filter based on different cuisines.
  - Implemented optional query parameters for all filtering options, allowing searches with any combination of filters.

- **Search Functionality**:
  - Implemented search based on restaurant name to filter and display relevant results.
