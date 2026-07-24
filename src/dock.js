// Dock Bar System
// macOS-style dock with magnification effect and context menus

import './dock.css';
import { createWindow } from './window-manager.js';
import { openCalculator } from './apps/calculator.js';
import { openTextEditor } from './apps/text-editor.js';
import { openSettings } from './apps/settings.js';

const DEFAULT_APPS = [
  { id: 'finder', name: 'Finder', icon: '📁' },
  { id: 'safari', name: 'Safari', icon: '🧭' },
  { id: 'mail', name: 'Mail', icon: '📧' },
  { id: 'maps', name: 'Maps', icon: '🗺️' },
  { id: 'photos', name: 'Photos', icon: '🖼️' },
  { id: 'messages', name: 'Messages', icon: '💬' },
  { id: 'calendar', name: 'Calendar', icon: '📅' },
  { id: 'notes', name: 'Notes', icon: '📝' },
  { id: 'music', name: 'Music', icon: '🎵' },
  { id: 'calculator', name: 'Calculator', icon: '🧮' },
  { id: 'textedit', name: 'TextEdit', icon: '📄' },
  { id: 'settings', name: 'System Settings', icon: '⚙️' },
];

let dockElement = null;
let dockItems = new Map();
let runningApps = new Map(); // appId -> window handle

/**
 * Initialize the dock bar
 */
export function initDock(apps = DEFAULT_APPS) {
  if (dockElement) return;

  dockElement = document.createElement('div');
  dockElement.className = 'dock';
  dockElement.id = 'dock';

  apps.forEach(app => {
    const item = createDockItem(app);
    dockElement.appendChild(item);
    dockItems.set(app.id, item);
  });

  // Add separator and trash
  const separator = document.createElement('div');
  separator.className = 'dock-separator';
  dockElement.appendChild(separator);

  const trash = createDockItem({ id: 'trash', name: 'Trash', icon: '🗑️' });
  dockElement.appendChild(trash);
  dockItems.set('trash', trash);

  document.getElementById('desktop').appendChild(dockElement);
  setupDockMagnification();
}

/**
 * Create a dock item element
 */
function createDockItem(app) {
  const item = document.createElement('div');
  item.className = 'dock-item';
  item.dataset.appId = app.id;
  item.dataset.appName = app.name;

  const icon = document.createElement('div');
  icon.className = 'dock-icon';
  icon.textContent = app.icon;

  const tooltip = document.createElement('div');
  tooltip.className = 'dock-tooltip';
  tooltip.textContent = app.name;

  item.appendChild(icon);
  item.appendChild(tooltip);

  // Click to open app
  item.addEventListener('click', (e) => {
    e.stopPropagation();
    handleDockItemClick(app);
  });

  // Right-click for context menu
  item.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    e.stopPropagation();
    showDockItemContextMenu(e, app);
  });

  return item;
}

/**
 * Handle dock item click
 */
function handleDockItemClick(app) {
  console.log(`Opening app: ${app.name}`);
  
  // Check if app is already running
  if (runningApps.has(app.id)) {
    const existingWindow = runningApps.get(app.id);
    existingWindow.focus();
    return;
  }
  
  // Bounce animation
  const item = dockItems.get(app.id);
  if (item) {
    item.classList.add('bounce');
    setTimeout(() => {
      item.classList.remove('bounce');
    }, 500);
  }

  // Launch specific apps with running state tracking
  let windowHandle;
  const windowOptions = {
    title: app.name,
    onClose: () => {
      // Remove running indicator when window closes
      runningApps.delete(app.id);
      if (item) {
        item.classList.remove('running');
      }
    },
  };

  if (app.id === 'calculator') {
    windowHandle = openCalculator();
  } else if (app.id === 'textedit') {
    windowHandle = openTextEditor();
  } else if (app.id === 'settings') {
    windowHandle = openSettings();
  } else {
    // Placeholder for other apps
    const container = document.createElement('div');
    container.style.cssText = 'display:flex;align-items:center;justify-content:center;height:100%;flex-direction:column;gap:12px;';
    
    const iconEmoji = document.createElement('div');
    iconEmoji.style.fontSize = '64px';
    iconEmoji.textContent = app.icon;
    
    const nameText = document.createElement('div');
    nameText.style.cssText = 'font-size:16px;color:#666;';
    nameText.textContent = app.name;
    
    container.appendChild(iconEmoji);
    container.appendChild(nameText);
    
    windowHandle = createWindow({
      ...windowOptions,
      content: container,
    });
  }
  
  // Track the running app
  if (windowHandle) {
    runningApps.set(app.id, windowHandle);
    if (item) {
      item.classList.add('running');
    }
  }
  }
}

/**
 * Show context menu for dock item
 */
function showDockItemContextMenu(e, app) {
  // Remove existing context menu
  const existing = document.querySelector('.dock-context-menu');
  if (existing) existing.remove();

  const isRunning = runningApps.has(app.id);
  const menu = document.createElement('div');
  menu.className = 'dock-context-menu';

  const openLabel = isRunning ? 'Show' : 'Open';
  const menuItems = [
    { action: 'open', label: openLabel },
  ];

  // Add Quit option if app is running
  if (isRunning) {
    menuItems.push({ action: 'quit', label: 'Quit' });
    menuItems.push({ separator: true });
  }

  menuItems.push({ action: 'options', label: 'Options' });
  menuItems.push({ separator: true });
  menuItems.push({ action: 'show-in-finder', label: 'Show in Finder' });
  menuItems.push({ separator: true });
  menuItems.push({ action: 'remove', label: 'Remove from Dock' });

  menuItems.forEach(def => {
    if (def.separator) {
      const sep = document.createElement('div');
      sep.className = 'dock-context-menu-separator';
      menu.appendChild(sep);
    } else {
      const item = document.createElement('div');
      item.className = 'dock-context-menu-item';
      item.dataset.action = def.action;
      item.textContent = def.label;
      menu.appendChild(item);
    }
  });

  // Position menu
  const x = e.clientX;
  const y = e.clientY - 200; // Show above click position
  menu.style.left = `${x}px`;
  menu.style.top = `${Math.max(10, y)}px`;

  document.body.appendChild(menu);

  // Add event listeners
  menu.querySelectorAll('.dock-context-menu-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      const action = item.dataset.action;
      console.log(`Dock context menu action: ${action} on ${app.name}`);
      
      if (action === 'open') {
        handleDockItemClick(app);
      } else if (action === 'quit') {
        if (runningApps.has(app.id)) {
          const windowHandle = runningApps.get(app.id);
          windowHandle.close();
        }
      } else if (action === 'remove') {
        removeDockItem(app.id);
      }
      
      menu.remove();
    });
  });

  // Close menu on click outside
  setTimeout(() => {
    document.addEventListener('click', function closeMenu() {
      menu.remove();
      document.removeEventListener('click', closeMenu);
    }, { once: true });
  }, 0);
}

/**
 * Remove an item from the dock
 */
export function removeDockItem(appId) {
  const item = dockItems.get(appId);
  if (item) {
    item.classList.add('removing');
    setTimeout(() => {
      item.remove();
      dockItems.delete(appId);
    }, 300);
  }
}

/**
 * Add an item to the dock
 */
export function addDockItem(app) {
  if (dockItems.has(app.id)) return;

  const item = createDockItem(app);
  const separator = dockElement.querySelector('.dock-separator');
  dockElement.insertBefore(item, separator);
  dockItems.set(app.id, item);
}

/**
 * Setup magnification effect on hover
 */
function setupDockMagnification() {
  const items = dockElement.querySelectorAll('.dock-item');
  
  dockElement.addEventListener('mousemove', (e) => {
    items.forEach(item => {
      const rect = item.getBoundingClientRect();
      const itemCenter = rect.left + rect.width / 2;
      const distance = Math.abs(e.clientX - itemCenter);
      const maxDistance = 150;
      
      if (distance < maxDistance) {
        const scale = 1 + (1 - distance / maxDistance) * 0.5; // Max 1.5x scale
        item.style.transform = `scale(${scale})`;
      } else {
        item.style.transform = 'scale(1)';
      }
    });
  });

  dockElement.addEventListener('mouseleave', () => {
    items.forEach(item => {
      item.style.transform = 'scale(1)';
    });
  });
}

/**
 * Get all dock apps
 */
export function getDockApps() {
  return Array.from(dockItems.keys());
}
