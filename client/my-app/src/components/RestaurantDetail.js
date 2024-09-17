


import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './RestaurantDetail.css'; // Import the CSS file

const RestaurantDetail = () => {
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    fetchRestaurantDetail();
  }, [id]);

  const fetchRestaurantDetail = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3001/restaurant/${id}`);
      if (!response.ok) {
        throw new Error('Restaurant not found');
      }
      const data = await response.json();
      setRestaurant(data);
    } catch (error) {
      console.error('Error fetching restaurant details:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!restaurant) return <div className="error">No restaurant found</div>;

  return (
    <div className="restaurant-detail">
      <h1>{restaurant.name}</h1>
      <img className="restaurant-image" src={restaurant.featured_image} alt={restaurant.name} />
      <div className="restaurant-info">
        <div className="info-item">
          <strong>Cuisines:</strong> {restaurant.cuisines}
        </div>
        <div className="info-item">
          <strong>Address:</strong> {restaurant.location.address}
        </div>
        <div className="info-item">
          <strong>Rating:</strong> {restaurant.user_rating.aggregate_rating} ({restaurant.user_rating.rating_text})
        </div>
        <div className="info-item">
          <strong>Average cost for two:</strong> {restaurant.currency}{restaurant.average_cost_for_two}
        </div>
        <div className="info-item">
          <strong>Has Online Delivery:</strong> {restaurant.has_online_delivery ? 'Yes' : 'No'}
        </div>
        <div className="info-item">
          <strong>Has Table Booking:</strong> {restaurant.has_table_booking ? 'Yes' : 'No'}
        </div>
      </div>
      {restaurant.menu_url && (
        <a href={restaurant.menu_url} target="_blank" rel="noopener noreferrer" className="menu-link">
          View Menu
        </a>
      )}
    </div>
  );
};

export default RestaurantDetail;