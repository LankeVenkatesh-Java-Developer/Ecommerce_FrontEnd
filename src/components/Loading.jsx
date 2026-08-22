import React from 'react';
import './Loading.css';

const Loading = ({ size = 'medium' }) => {
  return (
    <div className={`loading-container ${size}`}>
      <div className="spinner"></div>
      <p className="loading-text">Loading...</p>
    </div>
  );
};

export default Loading;
