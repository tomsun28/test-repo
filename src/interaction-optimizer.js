// Interaction Optimization System
// Provides animations, transitions, visual feedback, and keyboard shortcuts

import './interaction-optimizer.css';

// State management
let currentFocusedWindow = null;
let windowStack = []; // Track window z-index order for ⌘Tab
let shortcutsEnabled = true;

/**
 * Initialize interaction optimizations
 */
export function initInteractionOptimizer() {
  setupWindowAnimations();
  setupKeyboardShortcuts();
  setupVisualFeedback();
  setupDockEnhancements();
  setupMenuAnimations();
}

/**
 * Setup window open/close animations
 */
function setupWindowAnimations() {
  // Use MutationObserver to watch for new windows
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.classList && node.classList.contains('window')) {
          animateWindowOpen(node);
        }
      });

      mutation.removedNodes.forEach((node) => {
        if (node.classList && node.classList.contains('window')) {
          // Window is already removed, no animation needed
        }
      });
    });
  });

  const desktop = document.getElementById('desktop');
  if (desktop) {
    observer.observe(desktop, { childList: true, subtree: false });
  }
}

/**
 * Animate window opening
 */
function animateWindowOpen(windowEl) {
  windowEl.style.opacity = '0';
  windowEl.style.transform = 'scale(0.9)';
  
  requestAnimationFrame(() => {
    windowEl.style.transition = 'opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1), transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)';
    windowEl.style.opacity = '1';
    windowEl.style.transform = 'scale(1)';
    
    setTimeout(() => {
      windowEl.style.transition = '';
      windowEl.style.transform = '';
    }, 250);
  });
}

/**
 * Animate window closing (called before window removal)
 */
export function animateWindowClose(windowEl) {
  return new Promise((resolve) => {
    windowEl.style.transition = 'opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1), transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)';
    windowEl.style.opacity = '0';
    windowEl.style.transform = 'scale(0.9)';
    
    setTimeout(() => {
      resolve();
    }, 200);
  });
}

/**
 * Setup global keyboard shortcuts
 */
function setupKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    if (!shortcutsEnabled) return;

    // Check for modifier keys (⌘ on Mac, Ctrl on Windows/Linux)
    const isCmd = e.metaKey || e.ctrlKey;
    const isShift = e.shiftKey;
    const isAlt = e.altKey;

    // ⌘N - New window
    if (isCmd && !isShift && !isAlt && e.key === 'n') {
      e.preventDefault();
      triggerAction('new-window');
    }

    // ⌘W - Close current window
    if (isCmd && !isShift && !isAlt && e.key === 'w') {
      e.preventDefault();
      triggerAction('close-window');
    }

    // ⌘M - Minimize current window
    if (isCmd && !isShift && !isAlt && e.key === 'm') {
      e.preventDefault();
      triggerAction('minimize-window');
    }

    // ⌘F - Maximize current window
    if (isCmd && !isShift && !isAlt && e.key === 'f') {
      e.preventDefault();
      triggerAction('maximize-window');
    }

    // ⌘Q - Quit (close all windows)
    if (isCmd && !isShift && !isAlt && e.key === 'q') {
      e.preventDefault();
      triggerAction('quit-app');
    }

    // ⌘Space - Spotlight search (placeholder)
    if (isCmd && e.code === 'Space') {
      e.preventDefault();
      triggerAction('spotlight');
    }

    // Esc - Close menus
    if (e.key === 'Escape') {
      closeAllMenus();
    }

    // ⌘Tab - Switch windows
    if (isCmd && e.key === 'Tab') {
      e.preventDefault();
      triggerAction('switch-window');
    }

    // ⌘, - Preferences
    if (isCmd && e.key === ',') {
      e.preventDefault();
      triggerAction('preferences');
    }
  });
}

/**
 * Trigger an action based on keyboard shortcut
 */
function triggerAction(action) {
  switch (action) {
    case 'new-window':
      // Dispatch custom event for window manager to handle
      document.dispatchEvent(new CustomEvent('shortcut:new-window'));
      showVisualFeedback('New Window');
      break;

    case 'close-window':
      document.dispatchEvent(new CustomEvent('shortcut:close-window'));
      showVisualFeedback('Close Window');
      break;

    case 'minimize-window':
      document.dispatchEvent(new CustomEvent('shortcut:minimize-window'));
      showVisualFeedback('Minimize');
      break;

    case 'maximize-window':
      document.dispatchEvent(new CustomEvent('shortcut:maximize-window'));
      showVisualFeedback('Maximize');
      break;

    case 'quit-app':
      document.dispatchEvent(new CustomEvent('shortcut:quit-app'));
      showVisualFeedback('Quit Application');
      break;

    case 'spotlight':
      document.dispatchEvent(new CustomEvent('shortcut:spotlight'));
      showVisualFeedback('Spotlight Search');
      break;

    case 'switch-window':
      document.dispatchEvent(new CustomEvent('shortcut:switch-window'));
      break;

    case 'preferences':
      document.dispatchEvent(new CustomEvent('shortcut:preferences'));
      showVisualFeedback('Preferences');
      break;
  }
}

/**
 * Close all open menus (context menus, dropdowns)
 */
function closeAllMenus() {
  // Close context menus
  const contextMenus = document.querySelectorAll('.context-menu.visible, .dock-context-menu.visible');
  contextMenus.forEach(menu => {
    menu.classList.remove('visible');
  });

  // Close dropdown menus
  const dropdowns = document.querySelectorAll('.dropdown-menu.visible');
  dropdowns.forEach(dropdown => {
    dropdown.classList.remove('visible');
  });

  // Remove active state from menu items
  const menuItems = document.querySelectorAll('.menu-item.active');
  menuItems.forEach(item => {
    item.classList.remove('active');
  });
}

/**
 * Setup visual feedback system (toast notifications)
 */
function setupVisualFeedback() {
  // Create toast container
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }
}

/**
 * Show visual feedback toast
 */
export function showVisualFeedback(message, duration = 1500) {
  const toastContainer = document.getElementById('toast-container');
  if (!toastContainer) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  
  toastContainer.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.add('toast-show');
  });

  // Remove after duration
  setTimeout(() => {
    toast.classList.remove('toast-show');
    toast.classList.add('toast-hide');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, duration);
}

/**
 * Setup enhanced dock interactions
 */
function setupDockEnhancements() {
  const dock = document.querySelector('.dock');
  if (!dock) return;

  // Add ripple effect on dock item click
  dock.addEventListener('click', (e) => {
    const dockItem = e.target.closest('.dock-item');
    if (dockItem) {
      createRipple(e, dockItem);
    }
  });
}

/**
 * Create ripple effect
 */
function createRipple(event, element) {
  const ripple = document.createElement('span');
  ripple.className = 'ripple';
  
  const rect = element.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = event.clientX - rect.left - size / 2;
  const y = event.clientY - rect.top - size / 2;
  
  ripple.style.width = ripple.style.height = size + 'px';
  ripple.style.left = x + 'px';
  ripple.style.top = y + 'px';
  
  element.appendChild(ripple);
  
  setTimeout(() => {
    ripple.remove();
  }, 600);
}

/**
 * Setup menu bar animations
 */
function setupMenuAnimations() {
  // Watch for dropdown menu visibility changes
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
        const target = mutation.target;
        if (target.classList.contains('dropdown-menu') || 
            target.classList.contains('dock-context-menu')) {
          if (target.classList.contains('visible')) {
            target.classList.add('menu-animate-in');
          } else {
            target.classList.remove('menu-animate-in');
          }
        }
      }
    });
  });

  // Observe all menus
  const menus = document.querySelectorAll('.dropdown-menu, .dock-context-menu');
  menus.forEach(menu => {
    observer.observe(menu, { attributes: true, attributeFilter: ['class'] });
  });
}

/**
 * Track window focus for keyboard shortcuts
 */
export function trackWindowFocus(windowId) {
  currentFocusedWindow = windowId;
  
  // Maintain window stack
  windowStack = windowStack.filter(id => id !== windowId);
  windowStack.unshift(windowId);
}

/**
 * Get next window in stack (for ⌘Tab)
 */
export function getNextWindow() {
  if (windowStack.length < 2) return null;
  
  // Rotate stack
  const next = windowStack[1];
  windowStack.push(windowStack.shift());
  
  return next;
}

/**
 * Enable/disable keyboard shortcuts
 */
export function setShortcutsEnabled(enabled) {
  shortcutsEnabled = enabled;
}

/**
 * Show keyboard shortcuts help dialog
 */
export function showShortcutsHelp() {
  const shortcuts = [
    { keys: '⌘N', action: 'New Window' },
    { keys: '⌘W', action: 'Close Window' },
    { keys: '⌘M', action: 'Minimize Window' },
    { keys: '⌘F', action: 'Maximize Window' },
    { keys: '⌘Q', action: 'Quit Application' },
    { keys: '⌘Space', action: 'Spotlight Search' },
    { keys: '⌘Tab', action: 'Switch Window' },
    { keys: '⌘,', action: 'Preferences' },
    { keys: 'Esc', action: 'Close Menus' },
  ];

  const helpContent = `
    <div style="padding: 20px;">
      <h2 style="margin-bottom: 20px;">Keyboard Shortcuts</h2>
      <table style="width: 100%; border-collapse: collapse;">
        ${shortcuts.map(s => `
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 10px; font-family: monospace; background: #f5f5f5; border-radius: 4px;">${s.keys}</td>
            <td style="padding: 10px;">${s.action}</td>
          </tr>
        `).join('')}
      </table>
    </div>
  `;

  return helpContent;
}
