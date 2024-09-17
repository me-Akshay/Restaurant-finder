# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.


# Zomato Data Frontend

This is the frontend application for the Zomato Data project. It provides a user interface for viewing, searching, and exploring restaurant data.

## Tech Stack

- React.js
- HTML, CSS, JavaScript
- Axios (for making API requests)
- React Router (for navigation)

## Components

- **`AdvancedSearch.js`**: Handles the advanced search functionality, allowing users to filter restaurants by various criteria, such as cuisines, country, and average spend.
- **`ImageSearch.js`**: Allows users to upload an image to search for restaurants offering cuisines related to the image.
- **`LocationSearch.js`**: Provides a form for users to search restaurants within a specific latitude and longitude range.
- **`Navbar.js`**: The navigation bar component for routing to different pages.
- **`RestaurantDetail.js`**: Displays detailed information about a selected restaurant.
- **`RestaurantList.js`**: Shows a paginated list of restaurants and allows navigation to each restaurant's detail page.
- **`App.js`**: The main entry point of the application that incorporates all the components and sets up routing.

## Features

- **Restaurant List Page**: Displays a paginated list of restaurants and allows navigation to detailed restaurant pages.
- **Restaurant Detail Page**: Shows detailed information about a specific restaurant selected from the list.
- **Location Search**: Lets users search for restaurants based on latitude and longitude.
- **Image Search**: Enables users to upload an image and search for restaurants offering cuisines related to the uploaded image.
- **Advanced Search**: Allows users to filter restaurants by criteria such as country, average spend, and cuisines.



### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

