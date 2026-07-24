// Menu Bar System
// Top menu bar with Apple menu, application menus, and status indicators

import './menu-bar.css';

let menuBarElement = null;
let activeMenu = null;
let clockInterval = null;

/**
 * Initialize the menu bar.
 * @param {HTMLElement} container - The desktop container to append the menu bar to.
 */
export function initMenuBar(container) {
  // Prevent re-initialization (avoids stacking clock intervals and duplicate DOM)
  if (menuBarElement) {
    return;
  }
  menuBarElement = document.createElement('div');
  menuBarElement.className = 'menu-bar';

  // Left side: Apple menu + app menus
  const leftSection = document.createElement('div');
  leftSection.className = 'menu-bar-left';

  // Apple menu
  const appleMenu = createMenuItem('', 'apple-menu', [
    { label: 'About This Mac', action: 'about' },
    { separator: true },
    { label: 'System Preferences...', action: 'system-prefs' },
    { label: 'App Store...', action: 'app-store' },
    { separator: true },
    { label: 'Recent Items', action: 'recent', submenu: true },
    { separator: true },
    { label: 'Force Quit...', action: 'force-quit', shortcut: '⌥⌘⎋' },
    { separator: true },
    { label: 'Sleep', action: 'sleep' },
    { label: 'Restart...', action: 'restart' },
    { label: 'Shut Down...', action: 'shutdown' },
  ]);
  leftSection.appendChild(appleMenu);

  // Application menus
  const appMenus = [
    {
      label: 'Finder',
      id: 'finder-menu',
      items: [
        { label: 'About Finder', action: 'about-finder' },
        { separator: true },
        { label: 'Preferences...', action: 'finder-prefs', shortcut: '⌘,' },
        { separator: true },
        { label: 'Empty Trash...', action: 'empty-trash', shortcut: '⇧⌘⌫' },
      ],
    },
    {
      label: 'File',
      id: 'file-menu',
      items: [
        { label: 'New Finder Window', action: 'new-window', shortcut: '⌘N' },
        { label: 'New Folder', action: 'new-folder', shortcut: '⇧⌘N' },
        { separator: true },
        { label: 'Open', action: 'open', shortcut: '⌘O' },
        { label: 'Close Window', action: 'close', shortcut: '⌘W' },
        { separator: true },
        { label: 'Get Info', action: 'get-info', shortcut: '⌘I' },
      ],
    },
    {
      label: 'Edit',
      id: 'edit-menu',
      items: [
        { label: 'Undo', action: 'undo', shortcut: '⌘Z' },
        { label: 'Redo', action: 'redo', shortcut: '⇧⌘Z' },
        { separator: true },
        { label: 'Cut', action: 'cut', shortcut: '⌘X' },
        { label: 'Copy', action: 'copy', shortcut: '⌘C' },
        { label: 'Paste', action: 'paste', shortcut: '⌘V' },
        { separator: true },
        { label: 'Select All', action: 'select-all', shortcut: '⌘A' },
      ],
    },
    {
      label: 'View',
      id: 'view-menu',
      items: [
        { label: 'as Icons', action: 'view-icons', shortcut: '⌘1' },
        { label: 'as List', action: 'view-list', shortcut: '⌘2' },
        { label: 'as Columns', action: 'view-columns', shortcut: '⌘3' },
        { separator: true },
        { label: 'Show Path Bar', action: 'show-path', shortcut: '⌥⌘P' },
        { label: 'Show Status Bar', action: 'show-status', shortcut: '⌘/' },
      ],
    },
    {
      label: 'Window',
      id: 'window-menu',
      items: [
        { label: 'Minimize', action: 'minimize', shortcut: '⌘M' },
        { label: 'Zoom', action: 'zoom' },
        { separator: true },
        { label: 'Bring All to Front', action: 'bring-front' },
      ],
    },
    {
      label: 'Help',
      id: 'help-menu',
      items: [
        { label: 'macOS Help', action: 'macos-help' },
        { label: 'About Web Desktop', action: 'about-web' },
      ],
    },
  ];

  appMenus.forEach((menuConfig) => {
    const menuItem = createMenuItem(menuConfig.label, menuConfig.id, menuConfig.items);
    leftSection.appendChild(menuItem);
  });

  menuBarElement.appendChild(leftSection);

  // Right side: Status indicators
  const rightSection = document.createElement('div');
  rightSection.className = 'menu-bar-right';

  // WiFi indicator
  const wifiIndicator = createStatusIndicator('wifi', '📶', 'Wi-Fi: Connected');
  rightSection.appendChild(wifiIndicator);

  // Battery indicator
  const batteryIndicator = createStatusIndicator('battery', '🔋', 'Battery: 100%');
  rightSection.appendChild(batteryIndicator);

  // Clock
  const clock = createClock();
  rightSection.appendChild(clock);

  // Control Center
  const controlCenter = createStatusIndicator('control-center', '⚙️', 'Control Center');
  rightSection.appendChild(controlCenter);

  menuBarElement.appendChild(rightSection);

  container.appendChild(menuBarElement);

  // Close menus when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.menu-bar-item')) {
      closeAllMenus();
    }
  });

  // Update clock immediately and then every second
  updateClock();
  clockInterval = setInterval(updateClock, 1000);
}

/**
 * Create a menu item with dropdown.
 */
function createMenuItem(label, id, items) {
  const menuItem = document.createElement('div');
  menuItem.className = 'menu-bar-item';
  menuItem.dataset.menuId = id;

  const menuLabel = document.createElement('div');
  menuLabel.className = 'menu-bar-label';
  
  if (id === 'apple-menu') {
    menuLabel.textContent = '';
    menuLabel.style.fontFamily = 'Apple Logo, serif';
    menuLabel.style.fontSize = '16px';
  } else {
    menuLabel.textContent = label;
  }

  const dropdown = document.createElement('div');
  dropdown.className = 'menu-dropdown';

  items.forEach((item) => {
    if (item.separator) {
      const sep = document.createElement('div');
      sep.className = 'menu-separator';
      dropdown.appendChild(sep);
      return;
    }

    const menuItemEl = document.createElement('div');
    menuItemEl.className = 'menu-item';

    const itemLabel = document.createElement('span');
    itemLabel.textContent = item.label;
    menuItemEl.appendChild(itemLabel);

    if (item.shortcut) {
      const shortcut = document.createElement('span');
      shortcut.className = 'menu-shortcut';
      shortcut.textContent = item.shortcut;
      menuItemEl.appendChild(shortcut);
    }

    if (item.submenu) {
      const arrow = document.createElement('span');
      arrow.className = 'menu-arrow';
      arrow.textContent = '▶';
      menuItemEl.appendChild(arrow);
    }

    menuItemEl.addEventListener('click', (e) => {
      e.stopPropagation();
      handleMenuAction(item.action);
      closeAllMenus();
    });

    dropdown.appendChild(menuItemEl);
  });

  menuItem.appendChild(menuLabel);
  menuItem.appendChild(dropdown);

  // Toggle menu on click
  menuItem.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = menuItem.classList.contains('open');
    closeAllMenus();
    if (!isOpen) {
      menuItem.classList.add('open');
      activeMenu = menuItem;
    }
  });

  // Open menu on hover if another menu is already open
  menuItem.addEventListener('mouseenter', () => {
    if (activeMenu && activeMenu !== menuItem) {
      closeAllMenus();
      menuItem.classList.add('open');
      activeMenu = menuItem;
    }
  });

  return menuItem;
}

/**
 * Create a status indicator (WiFi, battery, etc.).
 */
function createStatusIndicator(id, icon, tooltip) {
  const indicator = document.createElement('div');
  indicator.className = 'status-indicator';
  indicator.dataset.indicatorId = id;
  indicator.title = tooltip;

  const iconEl = document.createElement('span');
  iconEl.className = 'status-icon';
  iconEl.textContent = icon;

  indicator.appendChild(iconEl);

  indicator.addEventListener('click', (e) => {
    e.stopPropagation();
    console.log(`Status indicator clicked: ${id}`);
  });

  return indicator;
}

/**
 * Create the clock display.
 */
function createClock() {
  const clock = document.createElement('div');
  clock.className = 'clock';
  clock.id = 'menu-bar-clock';
  clock.title = 'Click to open Calendar';

  clock.addEventListener('click', (e) => {
    e.stopPropagation();
    console.log('Clock clicked - open calendar');
  });

  return clock;
}

/**
 * Update the clock display.
 */
function updateClock() {
  const clockEl = document.getElementById('menu-bar-clock');
  if (!clockEl) return;

  const now = new Date();
  const options = {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  };

  clockEl.textContent = now.toLocaleString('en-US', options);
}

/**
 * Set the active app name displayed in the menu bar.
 * @param {string} appName - The name of the active application.
 */
export function setActiveApp(appName) {
  if (!menuBarElement) return;
  const finderLabel = menuBarElement.querySelector('[data-menu-id="finder-menu"] .menu-bar-label');
  if (finderLabel) {
    finderLabel.textContent = appName;
  }
}

/**
 * Close all open menus.
 */
function closeAllMenus() {
  if (!menuBarElement) return;
  menuBarElement.querySelectorAll('.menu-bar-item').forEach((item) => {
    item.classList.remove('open');
  });
  activeMenu = null;
}

/**
 * Handle menu actions.
 */
function handleMenuAction(action) {
  console.log(`Menu action: ${action}`);
  
  // Placeholder for actual implementations
  switch (action) {
    case 'about':
      alert('Web macOS Desktop\nVersion 1.0.0\n\nA web-based macOS desktop environment.');
      break;
    case 'system-prefs':
      console.log('Open System Preferences');
      break;
    case 'force-quit':
      console.log('Open Force Quit dialog');
      break;
    case 'sleep':
      console.log('System sleep');
      break;
    case 'restart':
      if (confirm('Are you sure you want to restart your computer?')) {
        console.log('Restarting...');
      }
      break;
    case 'shutdown':
      if (confirm('Are you sure you want to shut down your computer?')) {
        console.log('Shutting down...');
      }
      break;
    default:
      console.log(`Unhandled menu action: ${action}`);
  }
}
