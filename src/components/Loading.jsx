import React from 'react';

const Loading = ({ size = 'medium' }) => {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className={`animate-spin rounded-full border-4 border-gray-200 dark:border-gray-700 border-t-primary-500 ${sizeClasses[size]}`}></div>
      <p className="mt-4 text-gray-600 dark:text-gray-400 font-medium">Loading...</p>
    </div>
  );
};

export default Loading;
