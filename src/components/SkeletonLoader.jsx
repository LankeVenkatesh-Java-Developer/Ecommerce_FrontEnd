import React from 'react';

const SkeletonLoader = ({ className = '', variant = 'default' }) => {
  const baseClasses = 'animate-pulse bg-gray-200 dark:bg-gray-700 rounded';
  
  const variants = {
    default: 'h-4 w-full',
    text: 'h-4 w-3/4',
    title: 'h-6 w-1/2',
    avatar: 'h-10 w-10 rounded-full',
    button: 'h-10 w-20',
    card: 'h-48 w-full',
    image: 'aspect-square w-full',
    rectangle: 'h-16 w-full',
  };

  return (
    <div className={`${baseClasses} ${variants[variant] || variants.default} ${className}`} />
  );
};

export const ProductCardSkeleton = () => (
  <div className="card-3d p-4">
    <SkeletonLoader variant="image" className="rounded-t-xl mb-4" />
    <SkeletonLoader variant="title" className="mb-2" />
    <SkeletonLoader variant="text" className="mb-3" />
    <div className="flex items-center justify-between mt-4">
      <SkeletonLoader variant="button" />
      <SkeletonLoader variant="button" className="w-10 h-10 rounded-full" />
    </div>
  </div>
);

export const CategoryCardSkeleton = () => (
  <div className="card-3d aspect-square rounded-2xl overflow-hidden">
    <SkeletonLoader variant="image" className="rounded-2xl" />
  </div>
);

export default SkeletonLoader;
