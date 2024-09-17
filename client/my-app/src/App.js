
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RestaurantList from './components/RestaurantList';
import RestaurantDetail from './components/RestaurantDetail';
import LocationSearch from './components/LocationSearch';
import ImageSearch from './components/ImageSearch';
import Navbar from './components/Navbar';
import AdvancedSearch from './components/AdvancedSearch';
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const App = () => {
  return (
    <Router>
      <div className="app bg-light min-vh-100 d-flex flex-column">
        <Navbar />
        <Container className="flex-grow-1 mt-4">
          <Routes>
            <Route path="/" element={<RestaurantList />} />
            <Route path="/restaurant/:id" element={<RestaurantDetail />} />
            <Route path="/location-search" element={<LocationSearch />} />
            <Route path="/image-search" element={<ImageSearch />} />
            <Route path="/advanced-search" element={<AdvancedSearch />} />
          </Routes>
        </Container>
        <footer className="bg-dark text-light text-center py-3">
          <Container>
            <p className="mb-0">&copy; 2024 Restaurant Finder. Made By Akshay.</p>
          </Container>
        </footer>
      </div>
    </Router>
  );
};

export default App;