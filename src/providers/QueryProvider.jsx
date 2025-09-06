import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a client with optimized settings to prevent duplicate calls
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Global query options
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 2,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      refetchOnMount: false, // Prevent refetch on component mount if data exists
      refetchInterval: false, // Disable automatic refetching
      // Prevent duplicate requests
      networkMode: "online",
    },
    mutations: {
      // Global mutation options
      retry: 0, // Disable retry for mutations to prevent duplicates
      networkMode: "online",
      // Add mutation deduplication
      gcTime: 0, // Don't cache mutation results
    },
  },
});

const QueryProvider = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default QueryProvider;
