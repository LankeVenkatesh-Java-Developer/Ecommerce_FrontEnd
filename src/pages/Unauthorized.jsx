import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './NotFound.css';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found-page">
      <div className="not-found-content">
        <div className="not-found-icon">
          <FaExclamationTriangle />
        </div>
        <h1>403 - Unauthorized</h1>
        <p>You don't have permission to access this page.</p>
        <p className="not-found-subtitle">Admin privileges are required to view this content.</p>
        <div className="not-found-actions">
          <button className="btn btn-primary" onClick={() => navigate('/')}>
            Go to Home
          </button>
          <button className="btn btn-secondary" onClick={() => navigate(-1)}>
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
