import React from 'react';

const Loader = ({ size = 'md', fullScreen = false }) => {
  const sizeClasses = {
    sm: 'h-6 w-6 border-2',
    md: 'h-10 w-10 border-3',
    lg: 'h-16 w-16 border-4'
  };

  const loader = (
    <div className={`animate-spin rounded-full border-t-electric-purple border-b-transparent border-l-electric-purple border-r-electric-purple ${sizeClasses[size]}`}></div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-midnight-900 z-50">
        {loader}
        <p className="mt-4 text-gray-400 font-medium">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center p-4">
      {loader}
    </div>
  );
};

export default Loader;
