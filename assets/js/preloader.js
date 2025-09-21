/**
 * Professional Preloader with Theme Support
 * Smooth loading animation with progress tracking
 */

class PreloaderManager {
  constructor() {
    this.preloader = document.getElementById('preloader');
    this.isLoading = true;
    this.loadingDuration = 800; // 0.8 seconds total loading time
    
    this.init();
  }

  init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.startLoading());
    } else {
      this.startLoading();
    }
  }

  startLoading() {
    // Apply theme to preloader immediately
    this.applyTheme();
    
    // Prevent body scrolling
    document.body.classList.add('preloader-active');
    
    // Start the loading sequence
    this.simulateLoading();
    
    // Listen for theme changes
    this.setupThemeListener();
    
    // Ensure preloader hides even if loading takes too long
    setTimeout(() => {
      if (this.isLoading) {
        this.hidePreloader();
      }
    }, 8000); // Maximum 8 seconds
  }

  applyTheme() {
    const isDark = document.documentElement.classList.contains('dark');
    const preloader = this.preloader;
    
    if (isDark) {
      preloader.classList.add('dark-theme');
    } else {
      preloader.classList.remove('dark-theme');
    }
  }

  setupThemeListener() {
    // Listen for theme changes and update preloader accordingly
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          this.applyTheme();
        }
      });
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
  }

  simulateLoading() {
    // Simple timer-based loading
    setTimeout(() => {
      this.hidePreloader();
    }, this.loadingDuration);
  }

  hidePreloader() {
    if (!this.isLoading) return;
    
    this.isLoading = false;
    
    // Add hide class for smooth exit animation
    this.preloader.classList.add('hide');
    
    // Remove preloader from DOM after animation
    setTimeout(() => {
      if (this.preloader && this.preloader.parentNode) {
        this.preloader.parentNode.removeChild(this.preloader);
      }
      
      // Re-enable body scrolling
      document.body.classList.remove('preloader-active');
      
      // Trigger custom event for other scripts
      window.dispatchEvent(new CustomEvent('preloaderComplete', {
        detail: { duration: performance.now() }
      }));
    }, 200); // Match CSS transition duration
  }

  // Public method to manually hide preloader
  forceHide() {
    this.hidePreloader();
  }

  // Public method to get loading status
  getLoadingStatus() {
    return {
      isLoading: this.isLoading
    };
  }
}

// Enhanced theme detection and application
class ThemeManager {
  constructor() {
    this.init();
  }

  init() {
    // Apply theme immediately
    this.applyTheme();
    
    // Listen for theme changes
    this.setupThemeListener();
  }

  applyTheme() {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  setupThemeListener() {
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (!localStorage.getItem('theme')) {
        this.applyTheme();
      }
    });
  }
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Initialize theme manager
  new ThemeManager();
  
  // Initialize preloader
  window.preloaderManager = new PreloaderManager();
});

// Fallback for immediate execution if DOM is already ready
if (document.readyState !== 'loading') {
  new ThemeManager();
  window.preloaderManager = new PreloaderManager();
}

// Export for potential external use
window.PreloaderManager = PreloaderManager;
window.ThemeManager = ThemeManager;
