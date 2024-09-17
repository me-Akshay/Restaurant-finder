

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Card, Button, Pagination } from 'react-bootstrap';
import './ImageSearch.css'; // You'll need to update this CSS file

const ImageSearch = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    await fetchResults(1);
  };

  const fetchResults = async (page) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post(`http://localhost:3001/search/image?page=${page}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResults(response.data);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error searching restaurants:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return 'dark-green';
    if (rating >= 4.0) return 'green';
    if (rating >= 3.5) return 'yellow';
    if (rating >= 3.0) return 'orange';
    return 'red';
  };

  const renderPagination = () => {
    if (!results || results.totalPages <= 1) return null;

    return (
      <Pagination className="justify-content-center mt-4">
        <Pagination.Prev 
          onClick={() => fetchResults(currentPage - 1)} 
          disabled={currentPage === 1}
        />
        <Pagination.Item active>{currentPage}</Pagination.Item>
        <Pagination.Next 
          onClick={() => fetchResults(currentPage + 1)} 
          disabled={currentPage === results.totalPages}
        />
      </Pagination>
    );
  };

  return (
    <Container className="image-search py-5">
      <h1 className="text-center mb-4">Restaurant Image Search</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-3">
          <label htmlFor="image-upload" className="form-label">Upload an image</label>
          <input
            type="file"
            className="form-control"
            id="image-upload"
            onChange={handleFileChange}
            accept="image/*"
          />
        </div>
        {preview && (
          <div className="mb-3 text-center">
            <img src={preview} alt="Preview" className="img-fluid mb-3" style={{maxHeight: '200px'}} />
          </div>
        )}
        <Button
          type="submit"
          disabled={!file || loading}
          className="w-100"
        >
          {loading ? 'Searching...' : 'Search Restaurants'}
        </Button>
      </form>

      {results && (
        <div className="results-container p-4 rounded">
          <h2 className="text-center mb-4">Results for {results.cuisine} cuisine</h2>
          <Row>
            {results.restaurants.map((restaurant) => (
              <Col key={restaurant.res_id} md={4} className="mb-4">
                <Link to={`/restaurant/${restaurant.res_id}`} className="text-decoration-none">
                  <Card className="h-100 restaurant-card">
                    <Card.Img 
                      variant="top" 
                      src={restaurant.featured_image || 'https://via.placeholder.com/300x200'} 
                      className="restaurant-image" 
                    />
                    <Card.Body>
                      <Card.Title className="restaurant-name">{restaurant.name}</Card.Title>
                      <Card.Text>
                        <p><strong>Cuisines:</strong> {restaurant.cuisines}</p>
                        {restaurant.user_rating && (
                          <p>
                            <strong>Rating:</strong> 
                            <span className={`rating ${getRatingColor(parseFloat(restaurant.user_rating.aggregate_rating))}`}>
                              {restaurant.user_rating.aggregate_rating}
                            </span> 
                            <span className="rating-text">{restaurant.user_rating.rating_text}</span>
                          </p>
                        )}
                        <p><strong>Address:</strong> {restaurant.location ? restaurant.location.address : 'Address not available'}</p>
                        {restaurant.average_cost_for_two && (
                          <p><strong>Average Cost for Two:</strong> ${restaurant.average_cost_for_two}</p>
                        )}
                        <p><strong>Online Delivery:</strong> {restaurant.has_online_delivery ? 'Yes' : 'No'}</p>
                        <p><strong>Table Booking:</strong> {restaurant.has_table_booking ? 'Yes' : 'No'}</p>
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>
          {renderPagination()}
        </div>
      )}
    </Container>
  );
};

export default ImageSearch;
