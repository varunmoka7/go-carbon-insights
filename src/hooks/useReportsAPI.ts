
import { useState, useEffect } from 'react';

// Stub implementation for missing forum API
export const useReportsAPI = () => {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  return {
    reports,
    isLoading,
    error,
    fetchReports: () => Promise.resolve([]),
    updateReport: () => Promise.resolve(),
    deleteReport: () => Promise.resolve(),
  };
};
