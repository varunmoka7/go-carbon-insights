/**
 * Utility function to clear demo mode settings
 * This can be called when a user logs in to ensure demo mode doesn't interfere
 */
export const clearDemoMode = () => {
  // Clear demo mode from localStorage
  localStorage.removeItem('demoMode');
  
  // Clear demo mode from URL parameters
  const url = new URL(window.location.href);
  url.searchParams.delete('demo');
  
  // Update the URL without the demo parameter
  if (url.search !== window.location.search) {
    window.history.replaceState({}, '', url.toString());
  }
  
  console.log('Demo mode cleared');
};

/**
 * Check if demo mode is currently active
 */
export const isDemoModeActive = (): boolean => {
  const urlParams = new URLSearchParams(window.location.search);
  const urlDemoMode = urlParams.get('demo') === 'true';
  const localStorageDemoMode = localStorage.getItem('demoMode') === 'true';
  
  return urlDemoMode || localStorageDemoMode;
}; 