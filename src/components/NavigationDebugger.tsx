
import React, { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

const NavigationDebugger = () => {
  const location = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    console.log('🧭 Navigation Debug:', {
      pathname: location.pathname,
      search: location.search,
      hash: location.hash,
      state: location.state,
      navigationType,
      timestamp: new Date().toISOString()
    });
  }, [location, navigationType]);

  return null;
};

export default NavigationDebugger;
