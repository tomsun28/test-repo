// Menu Bar System
// Top menu bar with Apple menu, app menus, and status indicators

import './menu-bar.css';
import { createWindow } from './window-manager.js';

let menuBarElement = null;
let activeDropdown = null;
let clockInterval = null;

// Menu configurations
const appleMenu = [
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
  { label: 'Log Out...', action: 'logout', shortcut: '⇧⌘Q' },
];

const fileMenu = [
  { label: 'New Window', action: 'new-window', shortcut: '⌘N' },
  { label: 'New Tab', action: 'new-tab', shortcut: '⌘T' },
  { type: 'separator' },
  { label: 'Open...', action: 'open', shortcut: '⌘O' },
  { label: 'Open Recent', submenu: true, disabled: true },
  { type: 'separator' },
  { label: 'Close Window', action: 'close-window', shortcut: '⌘W' },
  { label: 'Close All Windows', action: 'close-all', shortcut: '⌥⌘W' },
  { type: 'separator' },
  { label: 'Get Info', action: 'get-info', shortcut: '⌘I' },
];

const editMenu = [
  { label: 'Undo', action: 'undo', shortcut: '⌘Z' },
  { label: 'Redo', action: 'redo', shortcut: '⇧⌘Z' },
  { type: 'separator' },
  { label: 'Cut', action: 'cut', shortcut: '⌘X' },
  { label: 'Copy', action: 'copy', shortcut: '⌘C' },
  { label: 'Paste', action: 'paste', shortcut: '⌘V' },
  { label: 'Select All', action: 'select-all', shortcut: '⌘A' },
  { type: 'separator' },
  { label: 'Find', action: 'find', shortcut: '⌘F' },
];

const viewMenu = [
  { label: 'as Icons', action: 'view-icons' },
  { label: 'as List', action: 'view-list' },
  { label: 'as Columns', action: 'view-columns' },
  { label: 'as Gallery', action: 'view-gallery' },
  { type: 'separator' },
  { label: 'Show Path Bar', action: 'show-pathbar' },
  { label: 'Show Status Bar', action: 'show-statusbar' },
  { label: 'Show Sidebar', action: 'show-sidebar' },
  { type: 'separator' },
  { label: 'Hide Sidebar', action: 'hide-sidebar' },
  { label: 'Enter Full Screen', action: 'fullscreen', shortcut: '⌃⌘F' },
];

const windowMenu = [
  { label: 'Minimize', action: 'minimize', shortcut: '⌘M' },
  { label: 'Zoom', action: 'zoom' },
  { type: 'separator' },
  { label: 'Tile Window to Left of Screen', action: 'tile-left' },
  { label: 'Tile Window to Right of Screen', action: 'tile-right' },
  { type: 'separator' },
  { label: 'Bring All to Front', action: 'bring-all-front' },
];

const helpMenu = [
  { label: 'Search', action: 'search-help' },
  { type: 'separator' },
  { label: 'macOS Help', action: 'macos-help' },
];

/**
 * Initialize the menu bar
 */
export function initMenuBar(desktop) {
  menuBarElement = document.createElement('div');
  menuBarElement.className = 'menu-bar';

  // Left side: Apple menu + app menus
  const leftSection = document.createElement('div');
  leftSection.className = 'menu-bar-left';

  // Apple menu
  const appleMenuItem = createMenuItem('apple', '', true);
  appleMenuItem.appendChild(createDropdownMenu('apple-dropdown', appleMenu, handleAppleMenuAction));
  leftSection.appendChild(appleMenuItem);

  // Finder menu (app name)
  const finderMenuItem = createMenuItem('finder', 'Finder', false, true);
  finderMenuItem.appendChild(createDropdownMenu('finder-dropdown', createFinderMenu(), handleFinderMenuAction));
  leftSection.appendChild(finderMenuItem);

  // File menu
  const fileMenuItem = createMenuItem('file', 'File');
  fileMenuItem.appendChild(createDropdownMenu('file-dropdown', fileMenu, handleFileMenuAction));
  leftSection.appendChild(fileMenuItem);

  // Edit menu
  const editMenuItem = createMenuItem('edit', 'Edit');
  editMenuItem.appendChild(createDropdownMenu('edit-dropdown', editMenu, handleEditMenuAction));
  leftSection.appendChild(editMenuItem);

  // View menu
  const viewMenuItem = createMenuItem('view', 'View');
  viewMenuItem.appendChild(createDropdownMenu('view-dropdown', viewMenu, handleViewMenuAction));
  leftSection.appendChild(viewMenuItem);

  // Window menu
  const windowMenuItem = createMenuItem('window', 'Window');
  windowMenuItem.appendChild(createDropdownMenu('window-dropdown', windowMenu, handleWindowMenuAction));
  leftSection.appendChild(windowMenuItem);

  // Help menu
  const helpMenuItem = createMenuItem('help', 'Help');
  helpMenuItem.appendChild(createDropdownMenu('help-dropdown', helpMenu, handleHelpMenuAction));
  leftSection.appendChild(helpMenuItem);

  menuBarElement.appendChild(leftSection);

  // Right side: Status indicators
  const rightSection = document.createElement('div');
  rightSection.className = 'menu-bar-right';

  // Battery
  const batteryIcon = createStatusIcon('battery', '🔋 100%');
  batteryIcon.addEventListener('click', () => showControlCenter(rightSection));
  rightSection.appendChild(batteryIcon);

  // WiFi
  const wifiIcon = createStatusIcon('wifi', '📶');
  wifiIcon.addEventListener('click', () => showControlCenter(rightSection));
  rightSection.appendChild(wifiIcon);

  // Control Center
  const controlCenterIcon = createStatusIcon('control-center', '⚙️');
  controlCenterIcon.addEventListener('click', () => showControlCenter(rightSection));
  rightSection.appendChild(controlCenterIcon);

  // Clock
  const clockText = createStatusText('clock');
  updateClock(clockText);
  clockInterval = setInterval(() => updateClock(clockText), 1000);
  rightSection.appendChild(clockText);

  menuBarElement.appendChild(rightSection);

  // Create control center
  const controlCenter = createControlCenter();
  menuBarElement.appendChild(controlCenter);

  desktop.insertBefore(menuBarElement, desktop.firstChild);

  // Close dropdowns when clicking outside
  desktop.addEventListener('click', (e) => {
    if (!e.target.closest('.menu-item') && !e.target.closest('.dropdown-menu')) {
      closeAllDropdowns();
    }
  });
}

/**
 * Create a menu item
 */
function createMenuItem(id, label, isApple = false, isBold = false) {
  const item = document.createElement('div');
  item.className = 'menu-item';
  if (isBold) item.classList.add('menu-item-bold');
  item.dataset.menuId = id;

  if (isApple) {
    const logo = document.createElement('span');
    logo.className = 'apple-logo';
    logo.textContent = '';
    item.appendChild(logo);
  } else {
    item.textContent = label;
  }

  item.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleDropdown(item);
  });

  return item;
}

/**
 * Create a dropdown menu
 */
function createDropdownMenu(id, items, actionHandler) {
  const dropdown = document.createElement('div');
  dropdown.className = 'dropdown-menu';
  dropdown.id = id;

  items.forEach(item => {
    if (item.type === 'separator') {
      const separator = document.createElement('div');
      separator.className = 'dropdown-menu-separator';
      dropdown.appendChild(separator);
    } else {
      const menuItem = document.createElement('div');
      menuItem.className = 'dropdown-menu-item';
      if (item.disabled) menuItem.classList.add('disabled');

      const labelSpan = document.createElement('span');
      labelSpan.textContent = item.label;
      menuItem.appendChild(labelSpan);

      if (item.shortcut) {
        const shortcutSpan = document.createElement('span');
        shortcutSpan.className = 'menu-shortcut';
        shortcutSpan.textContent = item.shortcut;
        menuItem.appendChild(shortcutSpan);
      }

      if (!item.disabled) {
        menuItem.addEventListener('click', (e) => {
          e.stopPropagation();
          actionHandler(item.action);
          closeAllDropdowns();
        });
      }

      dropdown.appendChild(menuItem);
    }
  });

  return dropdown;
}

/**
 * Create Finder-specific menu
 */
function createFinderMenu() {
  return [
    { label: 'About Finder', action: 'about-finder' },
    { type: 'separator' },
    { label: 'Preferences...', action: 'finder-preferences', shortcut: '⌘,' },
    { type: 'separator' },
    { label: 'Empty Trash...', action: 'empty-trash', shortcut: '⇧⌘⌫' },
    { type: 'separator' },
    { label: 'Hide Finder', action: 'hide-finder', shortcut: '⌘H' },
    { label: 'Hide Others', action: 'hide-others', shortcut: '⌥⌘H' },
    { label: 'Show All', action: 'show-all' },
  ];
}

/**
 * Create status icon
 */
function createStatusIcon(id, icon) {
  const statusIcon = document.createElement('div');
  statusIcon.className = 'status-icon';
  statusIcon.dataset.statusId = id;
  statusIcon.textContent = icon;
  return statusIcon;
}

/**
 * Create status text
 */
function createStatusText(id) {
  const statusText = document.createElement('div');
  statusText.className = 'status-text';
  statusText.dataset.statusId = id;
  return statusText;
}

/**
 * Update clock display
 */
function updateClock(clockElement) {
  const now = new Date();
  const day = now.toLocaleDateString('en-US', { weekday: 'short' });
  const month = now.toLocaleDateString('en-US', { month: 'short' });
  const date = now.getDate();
  const time = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  clockElement.textContent = `${day} ${month} ${date} ${time}`;
}

/**
 * Create control center
 */
function createControlCenter() {
  const controlCenter = document.createElement('div');
  controlCenter.className = 'control-center';
  controlCenter.id = 'control-center';

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

/**
 * Create control tile
 */
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

/**
 * Create slider control
 */
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
  input.value = value;

  slider.appendChild(labelDiv);
  slider.appendChild(input);

  return slider;
}

/**
 * Toggle dropdown visibility
 */
function toggleDropdown(menuItem) {
  const dropdown = menuItem.querySelector('.dropdown-menu');
  if (!dropdown) return;

  if (activeDropdown && activeDropdown !== dropdown) {
    activeDropdown.classList.remove('visible');
    const prevMenuItem = activeDropdown.parentElement;
    if (prevMenuItem) prevMenuItem.classList.remove('active');
  }

  const isVisible = dropdown.classList.contains('visible');
  if (isVisible) {
    dropdown.classList.remove('visible');
    menuItem.classList.remove('active');
    activeDropdown = null;
  } else {
    dropdown.classList.add('visible');
    menuItem.classList.add('active');
    activeDropdown = dropdown;
  }
}

/**
 * Close all dropdowns
 */
function closeAllDropdowns() {
  if (activeDropdown) {
    activeDropdown.classList.remove('visible');
    const menuItem = activeDropdown.parentElement;
    if (menuItem) menuItem.classList.remove('active');
    activeDropdown = null;
  }

  const controlCenter = document.getElementById('control-center');
  if (controlCenter) controlCenter.classList.remove('visible');
}

/**
 * Show control center
 */
function showControlCenter(rightSection) {
  const controlCenter = document.getElementById('control-center');
  if (!controlCenter) return;

  const isVisible = controlCenter.classList.contains('visible');
  closeAllDropdowns();

  if (!isVisible) {
    controlCenter.classList.add('visible');
  }
}

/**
 * Handle Apple menu actions
 */
function handleAppleMenuAction(action) {
  console.log(`Apple menu action: ${action}`);
  switch (action) {
    case 'about':
      createWindow({
        title: 'About This Mac',
        width: 500,
        height: 400,
        content: `<div style="text-align:center;padding:40px;">
          <div style="font-size:64px;margin-bottom:20px;"></div>
          <h2 style="margin-bottom:10px;">macOS Web</h2>
          <p style="color:#666;margin-bottom:20px;">Version 1.0.0</p>
          <p style="font-size:12px;color:#999;">© 2024 Web Desktop Project</p>
        </div>`,
      });
      break;
    case 'preferences':
      createWindow({
        title: 'System Preferences',
        width: 700,
        height: 500,
        content: '<div style="padding:20px;"><h2>System Preferences</h2><p style="color:#666;margin-top:10px;">Settings coming soon...</p></div>',
      });
      break;
  }
}

/**
 * Handle Finder menu actions
 */
function handleFinderMenuAction(action) {
  console.log(`Finder menu action: ${action}`);
}

/**
 * Handle File menu actions
 */
function handleFileMenuAction(action) {
  console.log(`File menu action: ${action}`);
  switch (action) {
    case 'new-window':
      createWindow({
        title: 'Untitled',
        width: 600,
        height: 400,
        content: '<div style="padding:20px;"><h3>New Window</h3></div>',
      });
      break;
  }
}

/**
 * Handle Edit menu actions
 */
function handleEditMenuAction(action) {
  console.log(`Edit menu action: ${action}`);
}

/**
 * Handle View menu actions
 */
function handleViewMenuAction(action) {
  console.log(`View menu action: ${action}`);
}

/**
 * Handle Window menu actions
 */
function handleWindowMenuAction(action) {
  console.log(`Window menu action: ${action}`);
}

/**
 * Handle Help menu actions
 */
function handleHelpMenuAction(action) {
  console.log(`Help menu action: ${action}`);
}
