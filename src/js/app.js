/**
 * MUSA - Main App Module
 * Platform detection and conditional loading of mobile/desktop bundles
 * This is the entry point - detects platform and loads appropriate assets
 */

// Platform detection - MUST run before any rendering
function isMobile() {
  // Check for touch capability and screen width
  const touch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const narrow = window.matchMedia('(max-width: 767px)').matches;
  // Mobile if touch AND narrow screen, OR very narrow screen
  return (touch && narrow) || window.innerWidth < 768;
}

function isDesktop() {
  return !isMobile();
}

// Dynamic CSS loading
export function loadCSS(href) {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.onload = resolve;
    link.onerror = reject;
    document.head.appendChild(link);
  });
}

// Dynamic JS module loading
export function loadJS(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.type = 'module';
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

// Apply platform class to #app
export function applyPlatformClass() {
  const app = document.getElementById('app');
  if (app) {
    app.className = isMobile() ? 'mobile' : 'desktop';
  }
}

// Main initialization - platform detection and asset loading
export async function init() {
  // Apply platform class immediately for CSS
  applyPlatformClass();
  
  // Listen for resize to handle orientation changes
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      applyPlatformClass();
      // Note: Full re-init on resize would require reloading modules
      // For now, CSS handles responsive adjustments
    }, 150);
  });

  try {
    // Load shared CSS variables first
    await loadCSS('src/css/variables.css');
    
    // Load platform-specific CSS
    if (isMobile()) {
      await loadCSS('src/css/mobile.css');
    } else {
      await loadCSS('src/css/desktop.css');
    }
    
    // Load the main app logic (ES module)
    // This will import and initialize all the modules
    await loadJS('src/js/main.js');
    
    console.log('MUSA loaded for', isMobile() ? 'mobile' : 'desktop');
  } catch (e) {
    console.error('Failed to load MUSA:', e);
    // Fallback: show error toast
    const toast = document.getElementById('toast');
    if (toast) {
      toast.textContent = 'Erro ao carregar o app. Recarregue a página.';
      toast.className = 'on';
    }
  }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Export for testing
window.MUSA = { isMobile, isDesktop, init };
