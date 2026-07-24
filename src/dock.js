// Dock Bar System
// macOS-style dock with magnification effect and context menus

import './dock.css';
import { createWindow } from './window-manager.js';
import { openFinder } from './finder.js';
import { createCalculator } from './apps/calculator.js';
import { createTextEditor } from './apps/text-editor.js';
import { createSettings } from './apps/settings.js';

const DEFAULT_APPS = [
  { id: 'finder', name: 'Finder', icon: '📁' },
  { id: 'calculator', name: 'Calculator', icon: '🧮' },
  { id: 'text-editor', name: 'Text Editor', icon: '📝' },
  { id: 'settings', name: 'System Settings', icon: '⚙️' },
  { id: 'safari', name: 'Safari', icon: '🧭' },
  { id: 'mail', name: 'Mail', icon: '📧' },
  { id: 'maps', name: 'Maps', icon: '🗺️' },
  { id: 'photos', name: 'Photos', icon: '🖼️' },
  { id: 'messages', name: 'Messages', icon: '💬' },
  { id: 'calendar', name: 'Calendar', icon: '📅' },
  { id: 'notes', name: 'Notes', icon: '📝' },
  { id: 'music', name: 'Music', icon: '🎵' },
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
 * Open an app by id - uses dedicated app content for known apps.
 */
function openApp(app) {
  let content;
  switch (app.id) {
    case 'calculator':
      content = createCalculator();
      break;
    case 'text-editor':
      content = createTextEditor();
      break;
    case 'settings':
      content = createSettings();
      break;
    default:
      content = createPlaceholderContent(app);
  }

  const opts = {
    title: app.name,
    content,
  };

  // App-specific window options
  if (app.id === 'calculator') {
    opts.width = 320;
    opts.height = 480;
    opts.minWidth = 280;
    opts.minHeight = 420;
  } else if (app.id === 'settings') {
    opts.width = 780;
    opts.height = 520;
    opts.minWidth = 600;
    opts.minHeight = 400;
  }

  const item = dockItems.get(app.id);

  // Track running app with onClose cleanup
  opts.onClose = () => {
    runningApps.delete(app.id);
    if (item) {
      item.classList.remove('running');
    }
  };

  const windowHandle = createWindow(opts);

  runningApps.set(app.id, windowHandle);
  if (item) {
    item.classList.add('running');
  }
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

  // Special handling for Finder app
  if (app.id === 'finder') {
    const windowHandle = openFinder('/');
    runningApps.set(app.id, windowHandle);
    const item = dockItems.get(app.id);
    if (item) {
      item.classList.add('running');
    }
    return;
  }

  openApp(app);
}

/**
 * Create placeholder content for apps that don't have a dedicated implementation.
 */
function createPlaceholderContent(app) {
  const wrap = document.createElement('div');
  wrap.style.cssText = 'display:flex;align-items:center;justify-content:center;height:100%;flex-direction:column;gap:12px;';

  const icon = document.createElement('div');
  icon.style.fontSize = '64px';
  icon.textContent = app.icon;
  wrap.appendChild(icon);

  const name = document.createElement('div');
  name.style.cssText = 'font-size:16px;color:#666;';
  name.textContent = app.name;
  wrap.appendChild(name);

  return wrap;
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
  const quitOption = isRunning ? `
    <div class="dock-context-menu-item" data-action="quit">Quit</div>
    <div class="dock-context-menu-separator"></div>
  ` : '';

  menu.innerHTML = `
    <div class="dock-context-menu-item" data-action="open">${openLabel}</div>
    ${quitOption}
    <div class="dock-context-menu-item" data-action="options">Options</div>
    <div class="dock-context-menu-separator"></div>
    <div class="dock-context-menu-item" data-action="show-in-finder">Show in Finder</div>
    <div class="dock-context-menu-separator"></div>
    <div class="dock-context-menu-item" data-action="remove">Remove from Dock</div>
  `;

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

  const magnify = (clientX) => {
    items.forEach(item => {
      const rect = item.getBoundingClientRect();
      const itemCenter = rect.left + rect.width / 2;
      const distance = Math.abs(clientX - itemCenter);
      const maxDistance = 150;
      
      if (distance < maxDistance) {
        const scale = 1 + (1 - distance / maxDistance) * 0.5;
        item.style.transform = `scale(${scale})`;
      } else {
        item.style.transform = 'scale(1)';
      }
    });
  };

  const resetScale = () => {
    items.forEach(item => {
      item.style.transform = 'scale(1)';
    });
  };

  dockElement.addEventListener('mousemove', (e) => magnify(e.clientX));
  dockElement.addEventListener('mouseleave', resetScale);

  dockElement.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      magnify(e.touches[0].clientX);
    }
  }, { passive: true });
  dockElement.addEventListener('touchend', resetScale);
  dockElement.addEventListener('touchcancel', resetScale);
}

/**
 * Get all dock apps
 */
export function getDockApps() {
  return Array.from(dockItems.keys());
}
