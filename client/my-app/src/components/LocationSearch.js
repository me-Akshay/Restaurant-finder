

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const LocationSearch = () => {
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [range, setRange] = useState('3');
  const [results, setResults] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3001/restaurants/search/location?lat=${latitude}&lon=${longitude}&range=${range}`);
      const data = await response.json();
      setResults(data.restaurants);
    } catch (error) {
      console.error('Error searching restaurants:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Restaurant Location Search</h1>
      <form onSubmit={handleSearch} className="mb-4">
        <div className="row g-3 justify-content-center">
          <div className="col-md-4">
            <input
              type="number"
              className="form-control"
              placeholder="Latitude"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              required
              step="any"
            />
          </div>
          <div className="col-md-4">
            <input
              type="number"
              className="form-control"
              placeholder="Longitude"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              required
              step="any"
            />
          </div>
          <div className="col-md-4">
            <input
              type="number"
              className="form-control"
              placeholder="Range (km)"
              value={range}
              onChange={(e) => setRange(e.target.value)}
              required
              min="0"
              step="0.1"
            />
          </div>
        </div>
        <div className="row mt-4">
          <div className="col-12 text-center">
            <button type="submit" className="btn btn-custom btn-lg px-5 py-3">Search</button>
          </div>
        </div>
      </form>
      {results.length > 0 && (
        <div className="results-container p-4 rounded" style={{ backgroundColor: '#f8f9fa' }}>
          <h2 className="mb-3">Search Results</h2>
          <div className="row row-cols-1 row-cols-md-3 g-4">
            {results.map((restaurant) => (
              <div key={restaurant.res_id} className="col">
                <Link to={`/restaurant/${restaurant.res_id}`} className="text-decoration-none">
                  <div className="card h-100 hover-shadow transition">
                    {restaurant.featured_image && (
                      <img src={restaurant.featured_image} className="card-img-top" alt={restaurant.name} style={{height: '200px', objectFit: 'cover'}} />
                    )}
                    <div className="card-body">
                      <h5 className="card-title">{restaurant.name}</h5>
                      <p className="card-text">
                        <strong>Cuisines:</strong> {restaurant.cuisines}<br />
                        <strong>Address:</strong> {restaurant.address}<br />
                        <strong>Rating:</strong> {restaurant.user_rating.aggregate_rating} ({restaurant.user_rating.rating_text})<br />
                        <strong>Distance:</strong> {restaurant.distance} km
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
      <style jsx>{`
        .btn-custom {
          background-color: #333333;
          color: white;
          transition: all 0.3s ease;
          font-size: 1.2rem;
          font-weight: bold;
        }
        .btn-custom:hover {
          background-color: #555555;
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }
        .hover-shadow:hover {
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        .transition {
          transition: all 0.3s ease;
        }
      `}</style>
    </div>
  );
};

export default LocationSearch;