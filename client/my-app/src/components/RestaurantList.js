
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Card, Button } from 'react-bootstrap';
import './RestaurantList.css';

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchRestaurants();
  }, [page]);

  const fetchRestaurants = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:3001/restaurants?page=${page}&per_page=9`);
      const data = await response.json();
      setRestaurants(data.restaurants);
      setTotalPages(data.total_pages);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrevPage = () => {
    setPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return 'dark-green';
    if (rating >= 4.0) return 'green';
    if (rating >= 3.5) return 'yellow';
    if (rating >= 3.0) return 'orange';
    return 'red';
  };

  return (
    <div className="restaurant-list bg-white p-4 rounded shadow" style={{ marginTop: '60px' }}>
      <h1 className="mb-4">Restaurant List</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <Row>
            {restaurants.map((restaurant) => (
              <Col key={restaurant.res_id} md={4} className="mb-4">
                <Link to={`/restaurant/${restaurant.res_id}`} className="text-decoration-none">
                  <Card className="h-100 hover-shadow">
                    <Card.Img variant="top" src={restaurant.featured_image || 'https://via.placeholder.com/300x200'} className="restaurant-image" />
                    <Card.Body>
                      <Card.Title className="restaurant-name">{restaurant.name}</Card.Title>
                      <Card.Text>
                        <p><strong>Cuisines:</strong> {restaurant.cuisines}</p>
                        <p>
                          <strong>Rating:</strong> 
                          <span className={`rating ${getRatingColor(parseFloat(restaurant.user_rating.aggregate_rating))}`}>
                            {restaurant.user_rating.aggregate_rating}
                          </span> 
                          <span className="rating-text">{restaurant.user_rating.rating_text}</span>
                        </p>
                        <p><strong>Online Delivery:</strong> {restaurant.has_online_delivery ? 'Yes' : 'No'}</p>
                        <p><strong>Table Booking:</strong> {restaurant.has_table_booking ? 'Yes' : 'No'}</p>
                        <p><strong>Average Cost for Two:</strong> ${restaurant.average_cost_for_two}</p>
                        <p className="location-segment">
                          <strong>Location:</strong> {restaurant.location.locality}
                        </p>
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>
          <div className="d-flex justify-content-between align-items-center mt-4">
            <Button onClick={handlePrevPage} disabled={page === 1}>
              Previous
            </Button>
            <span>Page {page} of {totalPages}</span>
            <Button onClick={handleNextPage} disabled={page === totalPages}>
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default RestaurantList;