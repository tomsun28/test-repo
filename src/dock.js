// Dock Bar Module
// Provides macOS-style dock with magnification, tooltips, and context menu

import './dock.css';

// Default dock apps
const defaultDockApps = [
  { id: 'finder', name: 'Finder', icon: '🔍', action: 'finder' },
  { id: 'launchpad', name: 'Launchpad', icon: '🚀', action: 'launchpad' },
  { id: 'safari', name: 'Safari', icon: '🧭', action: 'safari' },
  { id: 'messages', name: 'Messages', icon: '💬', action: 'messages' },
  { id: 'mail', name: 'Mail', icon: '📧', action: 'mail' },
  { id: 'maps', name: 'Maps', icon: '🗺️', action: 'maps' },
  { id: 'photos', name: 'Photos', icon: '📷', action: 'photos' },
  { id: 'facetime', name: 'FaceTime', icon: '📹', action: 'facetime' },
  { id: 'calendar', name: 'Calendar', icon: '📅', action: 'calendar' },
  { id: 'notes', name: 'Notes', icon: '📝', action: 'notes' },
  { id: 'reminders', name: 'Reminders', icon: '✅', action: 'reminders' },
  { id: 'music', name: 'Music', icon: '🎵', action: 'music' },
  { id: 'podcasts', name: 'Podcasts', icon: '🎙️', action: 'podcasts' },
  { id: 'appstore', name: 'App Store', icon: '🏪', action: 'appstore' },
  { id: 'settings', name: 'System Settings', icon: '⚙️', action: 'settings' },
];

// Track running apps
const runningApps = new Set();

let dockElement = null;
let contextMenu = null;

/**
 * Initialize the dock bar
 */
export function initDock() {
  const desktop = document.getElementById('desktop');
  
  // Create dock container
  dockElement = document.createElement('div');
  dockElement.className = 'dock';
  
  // Add dock apps
  defaultDockApps.forEach((app, index) => {
    // Add separator before settings
    if (app.id === 'settings') {
      const separator = document.createElement('div');
      separator.className = 'dock-separator';
      dockElement.appendChild(separator);
    }
    
    const dockItem = createDockItem(app);
    dockElement.appendChild(dockItem);
  });
  
  desktop.appendChild(dockElement);
  
  // Initialize magnification
  initMagnification();
  
  // Initialize context menu
  contextMenu = createDockContextMenu();
  desktop.appendChild(contextMenu);
  
  // Hide context menu on click elsewhere
  document.addEventListener('click', () => {
    hideDockContextMenu(contextMenu);
  });
}

/**
 * Create a dock item
 */
function createDockItem(app) {
  const item = document.createElement('div');
  item.className = 'dock-item';
  item.dataset.appId = app.id;
  
  item.innerHTML = `
    <div class="dock-tooltip">${app.name}</div>
    <div class="dock-item-icon">${app.icon}</div>
    <div class="dock-indicator"></div>
  `;
  
  // Click to launch app
  item.addEventListener('click', (e) => {
    e.stopPropagation();
    launchApp(app, item);
  });
  
  // Right-click for context menu
  item.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    e.stopPropagation();
    showDockContextMenu(e, app, item, contextMenu);
  });
  
  return item;
}

/**
 * Launch an app from the dock
 */
function launchApp(app, dockItem) {
  console.log(`Launching app: ${app.name}`);
  
  // Add bounce animation
  dockItem.classList.add('bouncing');
  setTimeout(() => {
    dockItem.classList.remove('bouncing');
  }, 600);
  
  // Mark as running
  runningApps.add(app.id);
  dockItem.classList.add('running');
  
  // Import window manager dynamically to avoid circular dependency
  import('./window-manager.js').then(({ createWindow }) => {
    createWindow({
      title: app.name,
      content: `<div style="display:flex;align-items:center;justify-content:center;height:100%;flex-direction:column;gap:12px;"><div style="font-size:64px;">${app.icon}</div><div style="font-size:16px;color:#666;">${app.name}</div></div>`,
      onClose: () => {
        // Remove running indicator when window closes
        runningApps.delete(app.id);
        dockItem.classList.remove('running');
      }
    });
  });
}

/**
 * Initialize magnification effect
 */
function initMagnification() {
  const dockItems = dockElement.querySelectorAll('.dock-item');
  
  dockElement.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX;
    
    dockItems.forEach((item) => {
      const rect = item.getBoundingClientRect();
      const itemCenterX = rect.left + rect.width / 2;
      const distance = Math.abs(mouseX - itemCenterX);
      
      // Clear all magnification classes
      item.classList.remove('magnified-1', 'magnified-2', 'magnified-3');
      
      // Apply magnification based on distance
      if (distance < 30) {
        item.classList.add('magnified-3');
      } else if (distance < 60) {
        item.classList.add('magnified-2');
      } else if (distance < 100) {
        item.classList.add('magnified-1');
      }
    });
  });
  
  // Reset magnification when mouse leaves dock
  dockElement.addEventListener('mouseleave', () => {
    dockItems.forEach((item) => {
      item.classList.remove('magnified-1', 'magnified-2', 'magnified-3');
    });
  });
}

/**
 * Create dock context menu
 */
function createDockContextMenu() {
  const menu = document.createElement('div');
  menu.className = 'dock-context-menu';
  return menu;
}

/**
 * Show context menu for a dock item
 */
function showDockContextMenu(e, app, dockItem, menu) {
  const isRunning = runningApps.has(app.id);
  
  menu.innerHTML = `
    <div class="dock-context-menu-item" data-action="open">${isRunning ? 'Show' : 'Open'} ${app.name}</div>
    ${isRunning ? '<div class="dock-context-menu-item" data-action="quit">Quit</div>' : ''}
    <div class="dock-context-menu-separator"></div>
    <div class="dock-context-menu-item" data-action="options">Options</div>
    <div class="dock-context-menu-item" data-action="show-in-finder">Show in Finder</div>
    <div class="dock-context-menu-separator"></div>
    <div class="dock-context-menu-item" data-action="remove">Remove from Dock</div>
  `;
  
  // Position menu above dock item
  const rect = dockItem.getBoundingClientRect();
  menu.style.left = `${rect.left}px`;
  menu.style.bottom = `${window.innerHeight - rect.top + 8}px`;
  
  menu.classList.add('visible');
  
  // Add event listeners
  menu.querySelectorAll('.dock-context-menu-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      const action = item.dataset.action;
      handleDockContextAction(action, app, dockItem);
      hideDockContextMenu(menu);
    });
  });
}

/**
 * Handle dock context menu actions
 */
function handleDockContextAction(action, app, dockItem) {
  console.log(`Dock action: ${action} on ${app.name}`);
  
  switch (action) {
    case 'open':
      launchApp(app, dockItem);
      break;
    case 'quit':
      // Close all windows for this app
      import('./window-manager.js').then(({ closeWindow }) => {
        // Find windows with this app title and close them
        const windows = document.querySelectorAll(`.window`);
        windows.forEach(win => {
          const title = win.querySelector('.window-title');
          if (title && title.textContent === app.name) {
            const windowId = win.dataset.windowId;
            closeWindow(windowId);
          }
        });
      });
      break;
    case 'remove':
      dockItem.remove();
      break;
    case 'show-in-finder':
      console.log(`Show ${app.name} in Finder`);
      break;
    case 'options':
      console.log(`Options for ${app.name}`);
      break;
  }
}

/**
 * Hide dock context menu
 */
function hideDockContextMenu(menu) {
  menu.classList.remove('visible');
}

/**
 * Mark an app as running (can be called from outside)
 */
export function markAppRunning(appId) {
  runningApps.add(appId);
  const dockItem = dockElement.querySelector(`[data-app-id="${appId}"]`);
  if (dockItem) {
    dockItem.classList.add('running');
  }
}

/**
 * Mark an app as not running (can be called from outside)
 */
export function markAppStopped(appId) {
  runningApps.delete(appId);
  const dockItem = dockElement.querySelector(`[data-app-id="${appId}"]`);
  if (dockItem) {
    dockItem.classList.remove('running');
  }
}
