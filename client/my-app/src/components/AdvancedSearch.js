




import React, { useState } from 'react';
import { Card, Col, Row, Container, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './AdvancedSearch.css';

const AdvancedSearch = () => {
  const [searchParams, setSearchParams] = useState({
    name: '',
    country: '',
    minSpend: '',
    maxSpend: '',
    cuisines: '',
  });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [resultsPerPage] = useState(9);

  const countryOptions = [
    { value: '', label: 'All Countries' },
    { value: 'India', label: 'India' },
    { value: 'Australia', label: 'Australia' },
    { value: 'Brazil', label: 'Brazil' },
    { value: 'Canada', label: 'Canada' },
    { value: 'Indonesia', label: 'Indonesia' },
    { value: 'New Zealand', label: 'New Zealand' },
    { value: 'Philippines', label: 'Philippines' },
    { value: 'Qatar', label: 'Qatar' },
    { value: 'Singapore', label: 'Singapore' },
    { value: 'South Africa', label: 'South Africa' },
    { value: 'Sri Lanka', label: 'Sri Lanka' },
    { value: 'Turkey', label: 'Turkey' },
    { value: 'UAE', label: 'UAE' },
    { value: 'United Kingdom', label: 'United Kingdom' },
    { value: 'United States', label: 'United States' },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prevParams => ({ ...prevParams, [name]: value }));
  };

  const handleSearch = async (e, page = 1) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const queryParams = new URLSearchParams({
      ...searchParams,
      page: page,
      limit: resultsPerPage,
    }).toString();

    try {
      const response = await fetch(`http://localhost:3001/restaurants/adv?${queryParams}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setResults(data.restaurants);
      setTotalResults(data.totalResults);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching results:', error);
      setError('An error occurred while fetching results. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    handleSearch(new Event('submit'), newPage);
  };

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return 'excellent';
    if (rating >= 4.0) return 'very-good';
    if (rating >= 3.5) return 'good';
    if (rating >= 3.0) return 'average';
    return 'poor';
  };

  return (
    <Container className="advanced-search-container">
      <h2 className="advanced-search-title">Advanced Search</h2>
      <Form onSubmit={(e) => handleSearch(e, 1)}>
        <Row>
          <Col md={6} className="mb-3">
            <Form.Group controlId="name">
              <Form.Label>Restaurant Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={searchParams.name}
                onChange={handleInputChange}
                placeholder="Enter restaurant name"
              />
            </Form.Group>
          </Col>
          <Col md={6} className="mb-3">
            <Form.Group controlId="country">
              <Form.Label>Country</Form.Label>
              <Form.Select
                name="country"
                value={searchParams.country}
                onChange={handleInputChange}
              >
                {countryOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6} className="mb-3">
            <Form.Group controlId="minSpend">
              <Form.Label>Minimum Spend</Form.Label>
              <Form.Control
                type="number"
                name="minSpend"
                value={searchParams.minSpend}
                onChange={handleInputChange}
                placeholder="Enter minimum spend"
              />
            </Form.Group>
          </Col>
          <Col md={6} className="mb-3">
            <Form.Group controlId="maxSpend">
              <Form.Label>Maximum Spend</Form.Label>
              <Form.Control
                type="number"
                name="maxSpend"
                value={searchParams.maxSpend}
                onChange={handleInputChange}
                placeholder="Enter maximum spend"
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={12} className="mb-3">
            <Form.Group controlId="cuisines">
              <Form.Label>Cuisines</Form.Label>
              <Form.Control
                type="text"
                name="cuisines"
                value={searchParams.cuisines}
                onChange={handleInputChange}
                placeholder="Enter cuisines (comma-separated)"
              />
            </Form.Group>
          </Col>
        </Row>
        <Button variant="primary" type="submit" className="w-100">
          Search
        </Button>
      </Form>
      
      {loading && <p className="loading-message">Loading...</p>}
      {error && <p className="error-message">{error}</p>}
      
      {results.length > 0 && (
        <div className="mt-4">
          <p>Showing {results.length} of {totalResults} results</p>
          <Row>
            {results.map((restaurant) => (
              <Col key={restaurant.res_id} md={4} className="mb-4">
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
                      <p><strong>Average Cost for Two:</strong> {restaurant.currency}{restaurant.average_cost_for_two}</p>
                      <p className="location-segment">
                        <strong>Location:</strong> {restaurant.location.locality}
                      </p>
                    </Card.Text>
                  </Card.Body>
                  <Card.Footer>
                    <Link to={`/restaurant/${restaurant.res_id}`} className="btn btn-primary w-100">View Details</Link>
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
          <div className="pagination">
            <Button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              variant="outline-primary"
              className="me-2"
            >
              Previous
            </Button>
            <span className="page-info">Page {currentPage} of {Math.ceil(totalResults / resultsPerPage)}</span>
            <Button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage * resultsPerPage >= totalResults}
              variant="outline-primary"
              className="ms-2"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </Container>
  );
};

export default AdvancedSearch;