// Dock Bar System
// Bottom dock with app icons, magnification effect, and right-click context menu

import './dock.css';

// Default dock applications
const DEFAULT_APPS = [
  { id: 'finder', name: 'Finder', icon: '🔍', category: 'app' },
  { id: 'launchpad', name: 'Launchpad', icon: '🚀', category: 'app' },
  { id: 'safari', name: 'Safari', icon: '🧭', category: 'app' },
  { id: 'messages', name: 'Messages', icon: '💬', category: 'app' },
  { id: 'mail', name: 'Mail', icon: '✉️', category: 'app' },
  { id: 'maps', name: 'Maps', icon: '🗺️', category: 'app' },
  { id: 'photos', name: 'Photos', icon: '📷', category: 'app' },
  { id: 'music', name: 'Music', icon: '🎵', category: 'app' },
  { id: 'notes', name: 'Notes', icon: '📝', category: 'app' },
  { id: 'reminders', name: 'Reminders', icon: '✅', category: 'app' },
];

const RECENT_APPS = [
  { id: 'calculator', name: 'Calculator', icon: '🧮', category: 'recent' },
  { id: 'settings', name: 'Settings', icon: '⚙️', category: 'recent' },
];

const runningApps = new Set();
let dockElement = null;
let contextMenuElement = null;

/**
 * Initialize the dock bar.
 * @param {HTMLElement} container - The desktop container to append the dock to.
 * @param {Function} onAppClick - Callback when a dock app is clicked, receives (appId, appData).
 */
export function initDock(container, onAppClick) {
  dockElement = document.createElement('div');
  dockElement.className = 'dock';

  // App section
  DEFAULT_APPS.forEach((app) => {
    dockElement.appendChild(createDockItem(app, onAppClick));
  });

  // Separator
  const sep = document.createElement('div');
  sep.className = 'dock-separator';
  dockElement.appendChild(sep);

  // Recent / utility section
  RECENT_APPS.forEach((app) => {
    dockElement.appendChild(createDockItem(app, onAppClick));
  });

  container.appendChild(dockElement);

  // Prevent desktop context menu when right-clicking dock background
  dockElement.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    e.stopPropagation();
    hideDockContextMenu();
  });

  // Context menu
  contextMenuElement = document.createElement('div');
  contextMenuElement.className = 'dock-context-menu';
  container.appendChild(contextMenuElement);

  // Magnification effect
  setupMagnification();

  // Hide dock context menu on click anywhere
  container.addEventListener('click', () => {
    hideDockContextMenu();
  });
}

/**
 * Create a dock item element.
 */
function createDockItem(app, onAppClick) {
  const item = document.createElement('div');
  item.className = 'dock-item';
  item.dataset.appId = app.id;

  const icon = document.createElement('div');
  icon.className = 'dock-item-icon';
  icon.textContent = app.icon;

  const tooltip = document.createElement('div');
  tooltip.className = 'dock-item-tooltip';
  tooltip.textContent = app.name;

  const indicator = document.createElement('div');
  indicator.className = 'dock-item-indicator';

  item.appendChild(tooltip);
  item.appendChild(icon);
  item.appendChild(indicator);

  // Click to launch / focus
  item.addEventListener('click', (e) => {
    e.stopPropagation();
    hideDockContextMenu();

    // Bounce animation
    item.classList.add('bouncing');
    setTimeout(() => item.classList.remove('bouncing'), 500);

    // Mark as running
    runningApps.add(app.id);
    item.classList.add('running');

    if (typeof onAppClick === 'function') {
      onAppClick(app.id, app);
    }
  });

  // Right-click context menu
  item.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    e.stopPropagation();
    showDockContextMenu(e, app, item);
  });

  return item;
}

/**
 * Set up the magnification effect:
 * Hovered item gets magnified, adjacent items get partially magnified.
 */
function setupMagnification() {
  if (!dockElement) return;

  const items = dockElement.querySelectorAll('.dock-item');

  items.forEach((item, index) => {
    item.addEventListener('mouseenter', () => {
      clearMagnification();
      item.classList.add('magnified');
      // Magnify neighbors
      if (index > 0 && items[index - 1].classList.contains('dock-item')) {
        items[index - 1].classList.add('magnified-neighbor');
      }
      if (index < items.length - 1 && items[index + 1].classList.contains('dock-item')) {
        items[index + 1].classList.add('magnified-neighbor');
      }
    });

    item.addEventListener('mouseleave', () => {
      // Only clear if mouse has left the dock entirely (handled by dock mouseleave)
    });
  });

  dockElement.addEventListener('mouseleave', () => {
    clearMagnification();
  });
}

function clearMagnification() {
  if (!dockElement) return;
  dockElement.querySelectorAll('.dock-item').forEach((item) => {
    item.classList.remove('magnified', 'magnified-neighbor');
  });
}

/**
 * Show the dock context menu for an app.
 */
function showDockContextMenu(e, app, itemEl) {
  hideDockContextMenu();

  const isRunning = runningApps.has(app.id);

  const menuItems = [
    { label: 'Open', action: 'open' },
    ...(isRunning ? [{ label: 'Options', action: 'options', submenu: true }] : []),
    { separator: true },
    { label: 'Show in Finder', action: 'show-in-finder' },
    ...(isRunning
      ? [
          { separator: true },
          { label: 'Quit', action: 'quit' },
        ]
      : []),
    { separator: true },
    { label: 'Options', action: 'options-menu', submenu: true },
  ];

  contextMenuElement.innerHTML = '';

  menuItems.forEach((menuItem) => {
    if (menuItem.separator) {
      const sep = document.createElement('div');
      sep.className = 'dock-context-menu-separator';
      contextMenuElement.appendChild(sep);
      return;
    }

    const el = document.createElement('div');
    el.className = 'dock-context-menu-item';
    el.textContent = menuItem.label;
    el.dataset.action = menuItem.action;

    el.addEventListener('click', (ev) => {
      ev.stopPropagation();
      handleDockMenuAction(menuItem.action, app);
      hideDockContextMenu();
    });

    contextMenuElement.appendChild(el);
  });

  // Position the menu above the dock item
  const itemRect = itemEl.getBoundingClientRect();
  const menuWidth = 180;

  let x = itemRect.left + itemRect.width / 2 - menuWidth / 2;
  // Clamp to viewport
  x = Math.max(8, Math.min(x, window.innerWidth - menuWidth - 8));
  const y = itemRect.top - 8; // will be adjusted after measuring height

  contextMenuElement.style.left = `${x}px`;
  contextMenuElement.style.bottom = `${window.innerHeight - y}px`;
  contextMenuElement.style.top = 'auto';
  contextMenuElement.classList.add('visible');
}

function hideDockContextMenu() {
  if (contextMenuElement) {
    contextMenuElement.classList.remove('visible');
  }
}

function handleDockMenuAction(action, app) {
  switch (action) {
    case 'open':
      console.log(`Dock: Open ${app.name}`);
      runningApps.add(app.id);
      markAppRunning(app.id);
      break;
    case 'quit':
      console.log(`Dock: Quit ${app.name}`);
      runningApps.delete(app.id);
      unmarkAppRunning(app.id);
      break;
    case 'show-in-finder':
      console.log(`Dock: Show in Finder for ${app.name}`);
      break;
    case 'options':
    case 'options-menu':
      console.log(`Dock: Options for ${app.name}`);
      break;
    default:
      console.log(`Dock: Unknown action ${action} for ${app.name}`);
  }
}

function markAppRunning(appId) {
  if (!dockElement) return;
  const item = dockElement.querySelector(`[data-app-id="${appId}"]`);
  if (item) item.classList.add('running');
}

function unmarkAppRunning(appId) {
  if (!dockElement) return;
  const item = dockElement.querySelector(`[data-app-id="${appId}"]`);
  if (item) item.classList.remove('running');
}
