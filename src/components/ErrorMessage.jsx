import React from 'react';
import { FaExclamationCircle } from 'react-icons/fa';
import './ErrorMessage.css';

const ErrorMessage = ({ message, onDismiss }) => {
  if (!message) return null;

  return (
    <div className="error-message">
      <FaExclamationCircle className="error-icon" />
      <span className="error-text">{message}</span>
      {onDismiss && (
        <button className="error-dismiss" onClick={onDismiss}>
          ×
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
