/**
 * Utility functions to remove Lovable branding elements
 * This ensures a clean, professional appearance for production deployment
 */

class BrandingRemovalService {
  private observer: MutationObserver | null = null;
  private intervalId: NodeJS.Timeout | null = null;
  private isActive: boolean = false;

  /**
   * Selectors to target Lovable branding elements
   */
  private readonly brandingSelectors = [
    // Class-based selectors
    '[class*="lovable"]',
    '[class*="gptengineer"]',
    '[class*="edit-with"]',
    '[class*="floating-badge"]',
    '[class*="edit-button"]',
    '[class*="lovable-watermark"]',
    '[class*="branding-badge"]',
    
    // ID-based selectors
    '[id*="lovable"]',
    '[id*="gptengineer"]',
    
    // Data attribute selectors
    '[data-lovable]',
    '[data-gptengineer]',
    
    // Fixed position elements in bottom-right (common badge location)
    'div[style*="position: fixed"][style*="bottom"]',
    'div[style*="position: fixed"][style*="right"]',
    '.fixed.bottom-4.right-4',
    '.fixed.bottom-5.right-5',
    '.fixed.bottom-6.right-6',
    
    // Link-based selectors
    'a[href*="lovable.dev"]',
    'a[href*="gptengineer.com"]',
    
    // Iframe selectors
    'iframe[src*="lovable"]',
    'iframe[src*="gptengineer"]',
    
    // Attribute-based selectors
    '[aria-label*="Edit with Lovable"]',
    '[title*="Edit with Lovable"]',
    '[alt*="Edit with Lovable"]'
  ];

  /**
   * Text patterns to search for in element content
   */
  private readonly brandingTextPatterns = [
    'Edit with Lovable',
    'Made with Lovable',
    'Built with Lovable',
    'Powered by Lovable',
    'lovable.dev',
    'gptengineer.com'
  ];

  /**
   * Remove all branding elements from the DOM
   */
  private removeBrandingElements(): void {
    try {
      // Remove elements by selectors
      this.brandingSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
          if (this.shouldRemoveElement(element)) {
            console.log('Removing branding element:', element);
            element.remove();
          }
        });
      });

      // Remove elements by text content
      this.removeElementsByTextContent();

      // Remove scripts that might be related to branding
      this.removeBrandingScripts();

    } catch (error) {
      console.warn('Error removing branding elements:', error);
    }
  }

  /**
   * Check if an element should be removed (avoid removing legitimate UI elements)
   */
  private shouldRemoveElement(element: Element): boolean {
    // Don't remove our own app's badge components
    if (element.closest('[data-gocarbontracker]') || 
        element.classList.contains('badge') || 
        element.classList.contains('ui-badge') ||
        element.classList.contains('status-badge') ||
        element.classList.contains('metric-badge')) {
      return false;
    }

    // Check for fixed positioning in bottom-right corner (common for badges)
    const styles = window.getComputedStyle(element);
    if (styles.position === 'fixed') {
      const bottom = styles.bottom;
      const right = styles.right;
      if ((bottom && parseInt(bottom) < 100) && (right && parseInt(right) < 100)) {
        return true;
      }
    }

    return true;
  }

  /**
   * Remove elements containing branding text
   */
  private removeElementsByTextContent(): void {
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      null
    );

    const elementsToRemove: Element[] = [];
    let node: Node | null;

    while ((node = walker.nextNode())) {
      const textContent = node.textContent?.toLowerCase() || '';
      
      if (this.brandingTextPatterns.some(pattern => 
        textContent.includes(pattern.toLowerCase())
      )) {
        // Find the parent element to remove
        let parent = node.parentElement;
        while (parent && parent !== document.body) {
          if (this.shouldRemoveElement(parent)) {
            elementsToRemove.push(parent);
            break;
          }
          parent = parent.parentElement;
        }
      }
    }

    elementsToRemove.forEach(element => {
      console.log('Removing element with branding text:', element);
      element.remove();
    });
  }

  /**
   * Remove any scripts that might be related to branding
   */
  private removeBrandingScripts(): void {
    const scripts = document.querySelectorAll('script[src*="lovable"], script[src*="gptengineer"]');
    scripts.forEach(script => {
      console.log('Removing branding script:', script);
      script.remove();
    });
  }

  /**
   * Set up mutation observer to watch for dynamically added branding elements
   */
  private setupMutationObserver(): void {
    if (this.observer) {
      this.observer.disconnect();
    }

    this.observer = new MutationObserver((mutations) => {
      let shouldCheck = false;

      mutations.forEach((mutation) => {
        // Check for added nodes
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          shouldCheck = true;
        }
        
        // Check for attribute changes that might indicate branding
        if (mutation.type === 'attributes') {
          const target = mutation.target as Element;
          if (mutation.attributeName === 'class' || 
              mutation.attributeName === 'style' ||
              mutation.attributeName === 'id') {
            shouldCheck = true;
          }
        }
      });

      if (shouldCheck) {
        // Debounce the removal to avoid excessive processing
        setTimeout(() => this.removeBrandingElements(), 100);
      }
    });

    this.observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style', 'id', 'data-lovable', 'data-gptengineer']
    });
  }

  /**
   * Start the branding removal service
   */
  public start(): void {
    if (this.isActive) {
      return;
    }

    this.isActive = true;
    console.log('Starting branding removal service for GoCarbonTracker');

    // Initial cleanup
    this.removeBrandingElements();

    // Set up mutation observer for dynamic content
    this.setupMutationObserver();

    // Set up interval-based cleanup as backup
    this.intervalId = setInterval(() => {
      this.removeBrandingElements();
    }, 5000); // Check every 5 seconds
  }

  /**
   * Stop the branding removal service
   */
  public stop(): void {
    if (!this.isActive) {
      return;
    }

    this.isActive = false;
    console.log('Stopping branding removal service');

    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  /**
   * Perform immediate branding removal
   */
  public removeNow(): void {
    this.removeBrandingElements();
  }
}

// Create singleton instance
const brandingRemovalService = new BrandingRemovalService();

/**
 * Initialize branding removal when DOM is ready
 */
export const initializeBrandingRemoval = (): void => {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      brandingRemovalService.start();
    });
  } else {
    brandingRemovalService.start();
  }
};

/**
 * Manual branding removal function
 */
export const removeBrandingNow = (): void => {
  brandingRemovalService.removeNow();
};

/**
 * Stop branding removal service
 */
export const stopBrandingRemoval = (): void => {
  brandingRemovalService.stop();
};

// Auto-initialize when module is imported
initializeBrandingRemoval();

export default brandingRemovalService;
