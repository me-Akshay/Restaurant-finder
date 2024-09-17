import React from 'react';

const Card = ({ name, rating, averagePrice }) => {
  return (
    <div className="card mb-3" style={{ width: '18rem' }}>
      <div className="card-body">
        <h5 className="card-title">{name}</h5>
        <h6 className="card-subtitle mb-2 text-muted">Rating: {rating}</h6>
        <p className="card-text">Average Price: ${averagePrice}</p>
      </div>
    </div>
  );
};

export default Card;
