import React, { forwardRef } from 'react';

const SearchBar = forwardRef(({ className = '', width = 'w-full', ...props }, ref) => {
  return (
    <div className={`relative flex items-center rounded-xl bg-slate-800/80 border border-slate-700/60 shadow-sm focus-within:border-sky-500/60 focus-within:ring-1 focus-within:ring-sky-500/30 transition-all ${width} ${className}`}>
      <input
        type="text"
        ref={ref}
        {...props}
        className="w-full h-10 px-3.5 bg-transparent rounded-xl font-montserrat text-xs sm:text-sm text-slate-100 placeholder:text-slate-400 focus:outline-none"
        placeholder="Search contacts..."
      />
    </div>
  );
});

export default SearchBar;
