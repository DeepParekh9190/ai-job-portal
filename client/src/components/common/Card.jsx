import React from 'react';

const Card = ({ children, hover = false, className = '', onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm transition-all duration-200 ${hover ? 'hover:bg-white/10 hover:border-white/20 hover:shadow-lg hover:shadow-electric-purple/5 cursor-pointer' : ''} ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
