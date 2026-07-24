// Menu Bar Module
// Top menu bar with Apple menu, app menus, and status indicators

import './menu-bar.css';

let menuBarElement = null;
let activeMenu = null;
let timeInterval = null;
let isInitialized = false;

// Menu definitions
const menus = {
  apple: {
    label: '',
    items: [
      { label: 'About This Mac', action: 'about' },
      { type: 'separator' },
      { label: 'System Preferences...', action: 'preferences' },
      { label: 'App Store...', action: 'appstore' },
      { type: 'separator' },
      { label: 'Recent Items', submenu: true },
      { type: 'separator' },
      { label: 'Force Quit...', action: 'forcequit', shortcut: '⌥⌘⎋' },
      { type: 'separator' },
      { label: 'Sleep', action: 'sleep' },
      { label: 'Restart...', action: 'restart' },
      { label: 'Shut Down...', action: 'shutdown' },
      { type: 'separator' },
      { label: 'Lock Screen', action: 'lock', shortcut: '⌃⌘Q' },
      { label: 'Log Out...', action: 'logout', shortcut: '⇧⌘Q' }
    ]
  },
  finder: {
    label: 'Finder',
    items: [
      { label: 'About Finder', action: 'about-finder' },
      { type: 'separator' },
      { label: 'Preferences...', action: 'finder-prefs', shortcut: '⌘,' },
      { type: 'separator' },
      { label: 'Empty Trash...', action: 'empty-trash', shortcut: '⇧⌘⌫' }
    ]
  },
  file: {
    label: 'File',
    items: [
      { label: 'New Finder Window', action: 'new-window', shortcut: '⌘N' },
      { label: 'New Folder', action: 'new-folder', shortcut: '⇧⌘N' },
      { type: 'separator' },
      { label: 'Open', action: 'open', shortcut: '⌘O' },
      { label: 'Close Window', action: 'close', shortcut: '⌘W' },
      { type: 'separator' },
      { label: 'Get Info', action: 'get-info', shortcut: '⌘I' }
    ]
  },
  edit: {
    label: 'Edit',
    items: [
      { label: 'Undo', action: 'undo', shortcut: '⌘Z' },
      { label: 'Redo', action: 'redo', shortcut: '⇧⌘Z' },
      { type: 'separator' },
      { label: 'Cut', action: 'cut', shortcut: '⌘X' },
      { label: 'Copy', action: 'copy', shortcut: '⌘C' },
      { label: 'Paste', action: 'paste', shortcut: '⌘V' },
      { label: 'Select All', action: 'select-all', shortcut: '⌘A' }
    ]
  },
  view: {
    label: 'View',
    items: [
      { label: 'as Icons', action: 'view-icons' },
      { label: 'as List', action: 'view-list' },
      { label: 'as Columns', action: 'view-columns' },
      { type: 'separator' },
      { label: 'Show Path Bar', action: 'show-pathbar' },
      { label: 'Show Status Bar', action: 'show-statusbar' }
    ]
  },
  window: {
    label: 'Window',
    items: [
      { label: 'Minimize', action: 'minimize', shortcut: '⌘M' },
      { label: 'Zoom', action: 'zoom' },
      { type: 'separator' },
      { label: 'Bring All to Front', action: 'bring-front' }
    ]
  },
  help: {
    label: 'Help',
    items: [
      { label: 'macOS Help', action: 'macos-help' },
      { label: 'Search', action: 'search-help' }
    ]
  }
};

// Create menu item element
function createMenuItem(menuId, menuData) {
  const menuItem = document.createElement('div');
  menuItem.className = 'menu-item';
  menuItem.dataset.menu = menuId;

  const label = document.createElement('span');
  label.className = 'menu-label';
  label.textContent = menuData.label;
  menuItem.appendChild(label);

  const dropdown = createDropdown(menuData.items);
  menuItem.appendChild(dropdown);

  menuItem.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu(menuItem, dropdown);
  });

  return menuItem;
}

// Create dropdown menu
function createDropdown(items) {
  const dropdown = document.createElement('div');
  dropdown.className = 'dropdown-menu';

  items.forEach(item => {
    if (item.type === 'separator') {
      const separator = document.createElement('div');
      separator.className = 'dropdown-separator';
      dropdown.appendChild(separator);
    } else {
      const menuItem = document.createElement('div');
      menuItem.className = 'dropdown-item';
      if (item.disabled) menuItem.classList.add('disabled');

      const labelSpan = document.createElement('span');
      labelSpan.textContent = item.label;
      menuItem.appendChild(labelSpan);

      if (item.shortcut) {
        const shortcutSpan = document.createElement('span');
        shortcutSpan.className = 'shortcut';
        shortcutSpan.textContent = item.shortcut;
        menuItem.appendChild(shortcutSpan);
      }

      if (!item.disabled) {
        menuItem.addEventListener('click', (e) => {
          e.stopPropagation();
          handleMenuAction(item.action);
          closeAllMenus();
        });
      }

      dropdown.appendChild(menuItem);
    }
  });

  return dropdown;
}

// Toggle menu open/close
function toggleMenu(menuItem, dropdown) {
  const isOpen = menuItem.classList.contains('active');
  
  closeAllMenus();
  
  if (!isOpen) {
    menuItem.classList.add('active');
    dropdown.classList.add('visible');
    activeMenu = menuItem;
  }
}

// Close all open menus
function closeAllMenus() {
  if (activeMenu) {
    activeMenu.classList.remove('active');
    const dropdown = activeMenu.querySelector('.dropdown-menu');
    if (dropdown) dropdown.classList.remove('visible');
    activeMenu = null;
  }
  
  document.querySelectorAll('.menu-item.active').forEach(item => {
    item.classList.remove('active');
  });
  
  document.querySelectorAll('.dropdown-menu.visible').forEach(dropdown => {
    dropdown.classList.remove('visible');
  });
}

// Handle menu action
function handleMenuAction(action) {
  console.log(`Menu action: ${action}`);
  
  switch (action) {
    case 'about':
      alert('About This Mac\nmacOS Web Edition\nVersion 1.0.0');
      break;
    case 'preferences':
      alert('System Preferences\nComing soon...');
      break;
    case 'forcequit':
      alert('Force Quit Applications\nNo applications to quit.');
      break;
  }
}

// Update time display
function updateTime() {
  const timeElement = document.querySelector('.status-time');
  if (!timeElement) return;
  
  const now = new Date();
  const day = now.toLocaleDateString('en-US', { weekday: 'short' });
  const month = now.toLocaleDateString('en-US', { month: 'short' });
  const date = now.getDate();
  const time = now.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });
  
  timeElement.textContent = `${day} ${month} ${date} ${time}`;
}

// Initialize menu bar
export function initMenuBar() {
  // Prevent duplicate initialization
  if (isInitialized) {
    console.warn('Menu bar already initialized');
    return;
  }
  isInitialized = true;
  
  // Clean up any existing interval
  if (timeInterval) {
    clearInterval(timeInterval);
    timeInterval = null;
  }
  
  menuBarElement = document.createElement('div');
  menuBarElement.className = 'menu-bar';

  // Left section: menus
  const leftSection = document.createElement('div');
  leftSection.className = 'menu-bar-left';

  // Add all menus
  Object.keys(menus).forEach(menuId => {
    const menuItem = createMenuItem(menuId, menus[menuId]);
    leftSection.appendChild(menuItem);
  });

  menuBarElement.appendChild(leftSection);

  // Right section: status indicators
  const rightSection = document.createElement('div');
  rightSection.className = 'menu-bar-right';

  // Battery
  const battery = document.createElement('span');
  battery.className = 'status-icon';
  battery.textContent = '🔋 100%';
  rightSection.appendChild(battery);

  // WiFi
  const wifi = document.createElement('span');
  wifi.className = 'status-icon';
  wifi.textContent = '📶';
  rightSection.appendChild(wifi);

  // Time
  const time = document.createElement('span');
  time.className = 'status-time';
  rightSection.appendChild(time);

  menuBarElement.appendChild(rightSection);

  // Insert at top of body
  document.body.insertBefore(menuBarElement, document.body.firstChild);

  // Start time updates
  updateTime();
  timeInterval = setInterval(updateTime, 1000);

  // Close menus when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.menu-bar')) {
      closeAllMenus();
    }
  });

  // Close menus on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllMenus();
    }
  });
}
