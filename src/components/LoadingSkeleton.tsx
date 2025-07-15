import React from 'react';

interface LoadingSkeletonProps {
  type: 'chatroom' | 'message' | 'country';
  count?: number;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ type, count = 1 }) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'chatroom':
        return (
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-2/3"></div>
              </div>
            </div>
          </div>
        );
      
      case 'message':
        return (
          <div className="mb-4 flex items-start space-x-3">
            <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>
            </div>
          </div>
        );
      
      case 'country':
        return (
          <div className="p-2 flex items-center space-x-2">
            <div className="w-6 h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse flex-1"></div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index}>{renderSkeleton()}</div>
      ))}
    </div>
  );
};