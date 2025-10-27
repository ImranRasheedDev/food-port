import React from 'react'

const LayoutWrapper = ({ children }) => {
  return (
    <div className="max-w-[1280px] mx-auto px-4">
      {children}
    </div>
  );
};

export default LayoutWrapper;