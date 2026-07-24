// Menu Bar Module
// Top menu bar with Apple menu, app menus, and status indicators

import './menu-bar.css';
import { createWindow } from './window-manager.js';

let menuBarElement = null;
let activeMenu = null;
let timeInterval = null;
let initialized = false;

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
      { label: 'Recent Items', submenu: true, disabled: true },
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
      { label: 'Empty Trash...', action: 'empty-trash', shortcut: '⇧⌘⌫' },
      { type: 'separator' },
      { label: 'Hide Finder', action: 'hide-finder', shortcut: '⌘H' },
      { label: 'Hide Others', action: 'hide-others', shortcut: '⌥⌘H' },
      { label: 'Show All', action: 'show-all' }
    ]
  },
  file: {
    label: 'File',
    items: [
      { label: 'New Window', action: 'new-window', shortcut: '⌘N' },
      { label: 'New Tab', action: 'new-tab', shortcut: '⌘T' },
      { type: 'separator' },
      { label: 'New Folder', action: 'new-folder', shortcut: '⇧⌘N' },
      { type: 'separator' },
      { label: 'Open...', action: 'open', shortcut: '⌘O' },
      { label: 'Open Recent', submenu: true, disabled: true },
      { type: 'separator' },
      { label: 'Close Window', action: 'close', shortcut: '⌘W' },
      { label: 'Close All Windows', action: 'close-all', shortcut: '⌥⌘W' },
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
      { label: 'Select All', action: 'select-all', shortcut: '⌘A' },
      { type: 'separator' },
      { label: 'Find', action: 'find', shortcut: '⌘F' }
    ]
  },
  view: {
    label: 'View',
    items: [
      { label: 'as Icons', action: 'view-icons', shortcut: '⌘1' },
      { label: 'as List', action: 'view-list', shortcut: '⌘2' },
      { label: 'as Columns', action: 'view-columns', shortcut: '⌘3' },
      { label: 'as Gallery', action: 'view-gallery' },
      { type: 'separator' },
      { label: 'Show Path Bar', action: 'toggle-path', shortcut: '⌥⌘P' },
      { label: 'Show Status Bar', action: 'toggle-status', shortcut: '⌘/' },
      { label: 'Show Sidebar', action: 'toggle-sidebar', shortcut: '⌥⌘S' },
      { type: 'separator' },
      { label: 'Hide Sidebar', action: 'hide-sidebar' },
      { label: 'Enter Full Screen', action: 'fullscreen', shortcut: '⌃⌘F' }
    ]
  },
  window: {
    label: 'Window',
    items: [
      { label: 'Minimize', action: 'minimize', shortcut: '⌘M' },
      { label: 'Zoom', action: 'zoom' },
      { type: 'separator' },
      { label: 'Tile Window to Left of Screen', action: 'tile-left' },
      { label: 'Tile Window to Right of Screen', action: 'tile-right' },
      { type: 'separator' },
      { label: 'Bring All to Front', action: 'bring-all-front' }
    ]
  },
  help: {
    label: 'Help',
    items: [
      { label: 'Search', action: 'search-help' },
      { type: 'separator' },
      { label: 'macOS Help', action: 'macos-help' }
    ]
  }
};

export function initMenuBar() {
  // Guard against re-initialization
  if (initialized) return;
  initialized = true;

  // Clear any existing interval from a previous instance
  if (timeInterval) {
    clearInterval(timeInterval);
    timeInterval = null;
  }

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
  wifiIcon.addEventListener('click', (e) => {
    e.stopPropagation();
    showControlCenter();
  });
  rightSide.appendChild(wifiIcon);

  // Battery indicator
  const batteryIcon = document.createElement('span');
  batteryIcon.className = 'status-icon';
  batteryIcon.textContent = '🔋';
  batteryIcon.title = 'Battery: 100%';
  batteryIcon.addEventListener('click', (e) => {
    e.stopPropagation();
    showControlCenter();
  });
  rightSide.appendChild(batteryIcon);

  // Control Center icon
  const controlCenterIcon = document.createElement('span');
  controlCenterIcon.className = 'status-icon';
  controlCenterIcon.textContent = '⚙️';
  controlCenterIcon.title = 'Control Center';
  controlCenterIcon.addEventListener('click', (e) => {
    e.stopPropagation();
    showControlCenter();
  });
  rightSide.appendChild(controlCenterIcon);

  // Time
  const timeElement = document.createElement('span');
  timeElement.className = 'status-time';
  rightSide.appendChild(timeElement);
  updateTime(timeElement);
  timeInterval = setInterval(() => updateTime(timeElement), 1000);

  menuBarElement.appendChild(leftSide);
  menuBarElement.appendChild(rightSide);

  // Create control center panel
  const controlCenter = createControlCenter();
  menuBarElement.appendChild(controlCenter);

  document.body.appendChild(menuBarElement);

  // Close menus when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.menu-item') && !e.target.closest('.menu-dropdown') && !e.target.closest('.control-center')) {
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
  if (menuKey === 'finder') label.classList.add('menu-label-bold');
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
      const dropdownItem = document.createElement('div');
      dropdownItem.className = 'menu-dropdown-item';
      if (item.disabled) dropdownItem.classList.add('disabled');

      const itemLabel = document.createElement('span');
      itemLabel.textContent = item.label;
      dropdownItem.appendChild(itemLabel);

      if (item.shortcut) {
        const shortcut = document.createElement('span');
        shortcut.className = 'menu-shortcut';
        shortcut.textContent = item.shortcut;
        dropdownItem.appendChild(shortcut);
      }

      if (item.submenu) {
        dropdownItem.classList.add('has-submenu');
        const arrow = document.createElement('span');
        arrow.className = 'submenu-arrow';
        arrow.textContent = '▶';
        dropdownItem.appendChild(arrow);
      }

      if (!item.disabled) {
        dropdownItem.addEventListener('click', (e) => {
          e.stopPropagation();
          if (item.action) {
            handleMenuAction(menuKey, item.action);
            closeAllMenus();
          }
        });
      }

      dropdown.appendChild(dropdownItem);
    }
  });

  menuItem.appendChild(dropdown);

  menuItem.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu(menuItem, dropdown);
  });

  return menuItem;
}

// Toggle menu open/close
function toggleMenu(menuItem, dropdown) {
  const isOpen = dropdown.style.display === 'block';

  closeAllMenus();

  if (!isOpen) {
    menuItem.classList.add('active');
    dropdown.style.display = 'block';
    activeMenu = menuItem;
  }
}

// Close all open menus
function closeAllMenus() {
  if (activeMenu) {
    activeMenu.classList.remove('active');
    const dropdown = activeMenu.querySelector('.menu-dropdown');
    if (dropdown) dropdown.style.display = 'none';
    activeMenu = null;
  }

  document.querySelectorAll('.menu-item.active').forEach(item => {
    item.classList.remove('active');
  });
  activeMenu = null;

  // Also close control center
  if (menuBarElement) {
    const controlCenter = menuBarElement.querySelector('.control-center');
    if (controlCenter) controlCenter.classList.remove('visible');
  }
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

/**
 * Create control center panel
 */
function createControlCenter() {
  const controlCenter = document.createElement('div');
  controlCenter.className = 'control-center';

  // Network row
  const networkRow = document.createElement('div');
  networkRow.className = 'control-center-row';

  const wifiTile = createControlTile('wifi', '📶', 'Wi-Fi', 'Home Network', true);
  const bluetoothTile = createControlTile('bluetooth', '🔵', 'Bluetooth', 'On', true);
  const airdropTile = createControlTile('airdrop', '📡', 'AirDrop', 'Contacts Only');

  networkRow.appendChild(wifiTile);
  networkRow.appendChild(bluetoothTile);
  networkRow.appendChild(airdropTile);
  controlCenter.appendChild(networkRow);

  // Display row
  const displayRow = document.createElement('div');
  displayRow.className = 'control-center-row';

  const brightnessTile = createControlTile('brightness', '☀️', 'Display', '100%');
  const soundTile = createControlTile('sound', '🔊', 'Sound', '80%');

  displayRow.appendChild(brightnessTile);
  displayRow.appendChild(soundTile);
  controlCenter.appendChild(displayRow);

  // Sliders
  const brightnessSlider = createSlider('brightness-slider', 'Display Brightness', 100);
  controlCenter.appendChild(brightnessSlider);

  const soundSlider = createSlider('sound-slider', 'Sound Volume', 80);
  controlCenter.appendChild(soundSlider);

  return controlCenter;
}

function createControlTile(id, icon, label, value, isActive = false) {
  const tile = document.createElement('div');
  tile.className = 'control-tile';
  if (isActive) tile.classList.add('active');
  tile.dataset.controlId = id;

  const iconDiv = document.createElement('div');
  iconDiv.className = 'control-tile-icon';
  iconDiv.textContent = icon;

  const labelDiv = document.createElement('div');
  labelDiv.className = 'control-tile-label';
  labelDiv.textContent = label;

  const valueDiv = document.createElement('div');
  valueDiv.className = 'control-tile-value';
  valueDiv.textContent = value;

  tile.appendChild(iconDiv);
  tile.appendChild(labelDiv);
  tile.appendChild(valueDiv);

  tile.addEventListener('click', (e) => {
    e.stopPropagation();
    tile.classList.toggle('active');
  });

  return tile;
}

function createSlider(id, label, value) {
  const slider = document.createElement('div');
  slider.className = 'control-slider';

  const labelDiv = document.createElement('div');
  labelDiv.className = 'control-slider-label';
  labelDiv.textContent = label;

  const input = document.createElement('input');
  input.type = 'range';
  input.className = 'control-slider-input';
  input.id = id;
  input.min = '0';
  input.max = '100';
  input.value = String(value);

  slider.appendChild(labelDiv);
  slider.appendChild(input);

  return slider;
}

function showControlCenter() {
  if (!menuBarElement) return;
  const controlCenter = menuBarElement.querySelector('.control-center');
  if (!controlCenter) return;

  const isVisible = controlCenter.classList.contains('visible');
  closeAllMenus();

  if (!isVisible) {
    controlCenter.classList.add('visible');
  }
}

function handleMenuAction(menu, action) {
  console.log(`Menu action: ${menu} -> ${action}`);

  // Handle About This Mac
  if (action === 'about') {
    createWindow({
      title: 'About This Mac',
      width: 500,
      height: 400,
      content: (() => {
        const div = document.createElement('div');
        div.style.cssText = 'text-align:center;padding:40px;';
        const icon = document.createElement('div');
        icon.style.cssText = 'font-size:64px;margin-bottom:20px;';
        icon.textContent = '';
        const h2 = document.createElement('h2');
        h2.style.marginBottom = '10px';
        h2.textContent = 'macOS Web';
        const ver = document.createElement('p');
        ver.style.cssText = 'color:#666;margin-bottom:20px;';
        ver.textContent = 'Version 1.0.0';
        const copy = document.createElement('p');
        copy.style.cssText = 'font-size:12px;color:#999;';
        copy.textContent = '© 2024 Web Desktop Project';
        div.appendChild(icon);
        div.appendChild(h2);
        div.appendChild(ver);
        div.appendChild(copy);
        return div;
      })()
    });
    return;
  }

  // Handle System Preferences
  if (action === 'preferences') {
    createWindow({
      title: 'System Preferences',
      width: 700,
      height: 500,
      content: (() => {
        const div = document.createElement('div');
        div.style.padding = '20px';
        const h2 = document.createElement('h2');
        h2.textContent = 'System Preferences';
        const p = document.createElement('p');
        p.style.cssText = 'color:#666;margin-top:10px;';
        p.textContent = 'Settings coming soon...';
        div.appendChild(h2);
        div.appendChild(p);
        return div;
      })()
    });
    return;
  }

  // Handle New Window
  if (action === 'new-window') {
    createWindow({
      title: 'Untitled',
      width: 600,
      height: 400,
      content: (() => {
        const div = document.createElement('div');
        div.style.padding = '20px';
        const h3 = document.createElement('h3');
        h3.textContent = 'New Window';
        div.appendChild(h3);
        return div;
      })()
    });
    return;
  }

  // Dispatch custom event for other modules to handle
  const event = new CustomEvent('menu-action', {
    detail: { menu, action }
  });
}

export function destroyMenuBar() {
  initialized = false;
  if (timeInterval) {
    clearInterval(timeInterval);
    timeInterval = null;
  }
  if (menuBarElement) {
    menuBarElement.remove();
    menuBarElement = null;
  }
  activeMenu = null;
}
