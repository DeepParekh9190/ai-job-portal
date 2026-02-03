import React, { forwardRef } from 'react';

const Input = forwardRef(({ 
  label, 
  error, 
  type = 'text', 
  className = '',
  icon: Icon,
  ...props 
}, ref) => {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-gray-300 mb-1.5">{label}</label>}
      <div className="relative">
        <input
          ref={ref}
          type={type}
          className={`w-full bg-white/5 border ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-white/10 focus:border-electric-purple focus:ring-electric-purple/20'} rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all duration-200 ${Icon ? 'pl-10' : ''} ${className}`}
          {...props}
        />
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Icon size={18} />
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
