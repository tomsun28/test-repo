// Menu Bar Module

import './menu-bar.css';

let menuBarElement = null;
let activeMenu = null;
let timeInterval = null;

// Menu definitions
const menus = {
  apple: {
    label: '',
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
      { label: 'Get Info', action: 'get-info', shortcut: '⌘I' },
      { label: 'Move to Trash', action: 'delete', shortcut: '⌘⌫' }
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
      { label: 'as Icons', action: 'view-icons', shortcut: '⌘1' },
      { label: 'as List', action: 'view-list', shortcut: '⌘2' },
      { label: 'as Columns', action: 'view-columns', shortcut: '⌘3' },
      { type: 'separator' },
      { label: 'Show Path Bar', action: 'toggle-path', shortcut: '⌥⌘P' },
      { label: 'Show Status Bar', action: 'toggle-status', shortcut: '⌘/' },
      { type: 'separator' },
      { label: 'Hide Sidebar', action: 'toggle-sidebar', shortcut: '⌥⌘S' }
    ]
  },
  window: {
    label: 'Window',
    items: [
      { label: 'Minimize', action: 'minimize', shortcut: '⌘M' },
      { label: 'Zoom', action: 'zoom' },
      { type: 'separator' },
      { label: 'Bring All to Front', action: 'bring-all-front' }
    ]
  },
  help: {
    label: 'Help',
    items: [
      { label: 'macOS Help', action: 'macos-help' },
      { type: 'separator' },
      { label: 'About This Web App', action: 'about-web' }
    ]
  }
};

export function initMenuBar() {
  menuBarElement = document.createElement('div');
  menuBarElement.className = 'menu-bar';
  menuBarElement.id = 'menu-bar';

  // Left side - menus
  const leftSide = document.createElement('div');
  leftSide.className = 'menu-bar-left';

  // Create menu items
  Object.keys(menus).forEach(menuKey => {
    const menuData = menus[menuKey];
    const menuItem = createMenuItem(menuKey, menuData);
    leftSide.appendChild(menuItem);
  });

  // Right side - status bar
  const rightSide = document.createElement('div');
  rightSide.className = 'menu-bar-right';

  // WiFi indicator
  const wifiIcon = document.createElement('span');
  wifiIcon.className = 'status-icon';
  wifiIcon.textContent = '📶';
  wifiIcon.title = 'Wi-Fi: Connected';
  rightSide.appendChild(wifiIcon);

  // Battery indicator
  const batteryIcon = document.createElement('span');
  batteryIcon.className = 'status-icon';
  batteryIcon.textContent = '🔋';
  batteryIcon.title = 'Battery: 100%';
  rightSide.appendChild(batteryIcon);

  // Time
  const timeElement = document.createElement('span');
  timeElement.className = 'status-time';
  rightSide.appendChild(timeElement);
  updateTime(timeElement);
  timeInterval = setInterval(() => updateTime(timeElement), 1000);

  menuBarElement.appendChild(leftSide);
  menuBarElement.appendChild(rightSide);

  document.body.appendChild(menuBarElement);

  // Close menus when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.menu-item') && !e.target.closest('.menu-dropdown')) {
      closeAllMenus();
    }
  });
}

function createMenuItem(menuKey, menuData) {
  const menuItem = document.createElement('div');
  menuItem.className = 'menu-item';
  menuItem.dataset.menu = menuKey;

  const label = document.createElement('span');
  label.className = 'menu-label';
  label.textContent = menuData.label;
  menuItem.appendChild(label);

  // Create dropdown
  const dropdown = document.createElement('div');
  dropdown.className = 'menu-dropdown';
  dropdown.style.display = 'none';

  menuData.items.forEach(item => {
    if (item.type === 'separator') {
      const separator = document.createElement('div');
      separator.className = 'menu-separator';
      dropdown.appendChild(separator);
    } else {
      const menuItem = document.createElement('div');
      menuItem.className = 'menu-dropdown-item';
      
      const itemLabel = document.createElement('span');
      itemLabel.textContent = item.label;
      menuItem.appendChild(itemLabel);

      if (item.shortcut) {
        const shortcut = document.createElement('span');
        shortcut.className = 'menu-shortcut';
        shortcut.textContent = item.shortcut;
        menuItem.appendChild(shortcut);
      }

      if (item.submenu) {
        menuItem.classList.add('has-submenu');
        const arrow = document.createElement('span');
        arrow.className = 'submenu-arrow';
        arrow.textContent = '▶';
        menuItem.appendChild(arrow);
      }

      menuItem.addEventListener('click', (e) => {
        e.stopPropagation();
        if (item.action) {
          handleMenuAction(menuKey, item.action);
          closeAllMenus();
        }
      });

      dropdown.appendChild(menuItem);
    }
  });

  menuItem.appendChild(dropdown);

  // Click to toggle menu
  menuItem.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu(menuItem, dropdown);
  });

  // Hover to switch menus when one is open
  menuItem.addEventListener('mouseenter', () => {
    if (activeMenu && activeMenu !== menuItem) {
      closeAllMenus();
      toggleMenu(menuItem, dropdown);
    }
  });

  return menuItem;
}

function toggleMenu(menuItem, dropdown) {
  const isOpen = dropdown.style.display === 'block';
  
  closeAllMenus();
  
  if (!isOpen) {
    dropdown.style.display = 'block';
    menuItem.classList.add('active');
    activeMenu = menuItem;
  }
}

function closeAllMenus() {
  document.querySelectorAll('.menu-dropdown').forEach(dropdown => {
    dropdown.style.display = 'none';
  });
  document.querySelectorAll('.menu-item').forEach(item => {
    item.classList.remove('active');
  });
  activeMenu = null;
}

function updateTime(timeElement) {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const day = days[now.getDay()];
  
  timeElement.textContent = `${day} ${displayHours}:${minutes} ${ampm}`;
}

function handleMenuAction(menu, action) {
  console.log(`Menu action: ${menu} -> ${action}`);
  
  // Dispatch custom event for other modules to handle
  const event = new CustomEvent('menu-action', {
    detail: { menu, action }
  });
  document.dispatchEvent(event);
}

export function destroyMenuBar() {
  if (timeInterval) {
    clearInterval(timeInterval);
  }
  if (menuBarElement) {
    menuBarElement.remove();
  }
}
