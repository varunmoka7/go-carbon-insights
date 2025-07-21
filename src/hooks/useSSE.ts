
import { useState, useEffect } from 'react';

// Stub implementation for Server-Sent Events
export const useSSE = (url: string) => {
  const [data, setData] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log(`SSE connection to ${url} - stubbed implementation`);
    setIsConnected(true);
    
    return () => {
      setIsConnected(false);
    };
  }, [url]);

  return {
    data,
    isConnected,
    error,
  };
};
