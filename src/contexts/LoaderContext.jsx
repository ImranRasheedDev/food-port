import React, { createContext, useContext, useState, useMemo } from 'react';

const LoaderContext = createContext();

export const LoaderProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Loading...');

  const showLoader = (message = 'Loading...') => {
    setLoadingMessage(message);
    setIsLoading(true);
  };

  const hideLoader = () => {
    setIsLoading(false);
  };

  const value = useMemo(
    () => ({
      isLoading,
      loadingMessage,
      showLoader,
      hideLoader,
    }),
    [isLoading, loadingMessage]
  );

  return (
    <LoaderContext.Provider value={value}>
      {children}
    </LoaderContext.Provider>
  );
};

export const useLoader = () => {
  const context = useContext(LoaderContext);
  if (!context) {
    throw new Error('useLoader must be used within LoaderProvider');
  }
  return context;
};

