// Web macOS Desktop - Main Entry Point

import './style.css';
import { createWindow } from './window-manager.js';

console.log('Web macOS Desktop initialized');

// Desktop icons configuration
const desktopIcons = [
  { id: 'macintosh-hd', name: 'Macintosh HD', icon: '💾' },
  { id: 'documents', name: 'Documents', icon: '📁' },
  { id: 'downloads', name: 'Downloads', icon: '📥' },
  { id: 'applications', name: 'Applications', icon: '📱' }
];

// Initialize desktop
function initDesktop() {
  const desktop = document.getElementById('desktop');
  
  // Create desktop icons container
  const iconsContainer = document.createElement('div');
  iconsContainer.className = 'desktop-icons';
  
  // Render desktop icons
  desktopIcons.forEach(iconData => {
    const iconElement = createDesktopIcon(iconData);
    iconsContainer.appendChild(iconElement);
  });
  
  desktop.appendChild(iconsContainer);
  
  // Initialize context menu
  initContextMenu(desktop, iconsContainer);
}

// Create desktop icon element
function createDesktopIcon(iconData) {
  const icon = document.createElement('div');
  icon.className = 'desktop-icon';
  icon.dataset.id = iconData.id;
  
  const iconImage = document.createElement('div');
  iconImage.className = 'desktop-icon-image';
  iconImage.textContent = iconData.icon;

  const iconLabel = document.createElement('div');
  iconLabel.className = 'desktop-icon-label';
  iconLabel.textContent = iconData.name;

  icon.appendChild(iconImage);
  icon.appendChild(iconLabel);
  
  // Click to select
  icon.addEventListener('click', (e) => {
    e.stopPropagation();
    selectIcon(icon);
  });
  
  // Double click to open
  icon.addEventListener('dblclick', (e) => {
    e.stopPropagation();
    openIcon(iconData);
  });
  
  return icon;
}

// Open an icon (creates a window)
function openIcon(iconData) {
  const contentDiv = document.createElement('div');
  contentDiv.style.cssText = 'display:flex;align-items:center;justify-content:center;height:100%;flex-direction:column;gap:12px;';
  
  const iconEmoji = document.createElement('div');
  iconEmoji.style.fontSize = '64px';
  iconEmoji.textContent = iconData.icon;
  
  const nameText = document.createElement('div');
  nameText.style.cssText = 'font-size:16px;color:#666;';
  nameText.textContent = iconData.name;
  
  contentDiv.appendChild(iconEmoji);
  contentDiv.appendChild(nameText);
  
  createWindow({
    title: iconData.name,
    content: contentDiv,
  });
}

// Select desktop icon
function selectIcon(icon) {
  // Deselect all icons
  document.querySelectorAll('.desktop-icon').forEach(el => {
    el.classList.remove('selected');
  });
  
  // Select clicked icon
  icon.classList.add('selected');
}

// Initialize context menu
function initContextMenu(desktop, iconsContainer) {
  const contextMenu = createContextMenu();
  desktop.appendChild(contextMenu);
  
  // Right-click on desktop
  desktop.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    
    // Check if clicked on icon
    const icon = e.target.closest('.desktop-icon');
    
    if (icon) {
      showIconContextMenu(e, icon, contextMenu);
    } else {
      showDesktopContextMenu(e, contextMenu);
    }
  });
  
  // Click anywhere to close menu
  desktop.addEventListener('click', () => {
    hideContextMenu(contextMenu);
    // Deselect icons
    document.querySelectorAll('.desktop-icon').forEach(el => {
      el.classList.remove('selected');
    });
  });
}

// Create context menu element
function createContextMenu() {
  const menu = document.createElement('div');
  menu.className = 'context-menu';
  return menu;
}

// Show context menu for desktop
function showDesktopContextMenu(e, menu) {
  menu.innerHTML = `
    <div class="context-menu-item" data-action="new-folder">New Folder</div>
    <div class="context-menu-separator"></div>
    <div class="context-menu-item" data-action="get-info">Get Info</div>
    <div class="context-menu-item" data-action="change-wallpaper">Change Desktop Background</div>
    <div class="context-menu-separator"></div>
    <div class="context-menu-item" data-action="sort-by">Sort By</div>
    <div class="context-menu-item" data-action="clean-up">Clean Up</div>
  `;
  
  positionContextMenu(e, menu);
  menu.classList.add('visible');
  
  // Add event listeners
  menu.querySelectorAll('.context-menu-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      const action = item.dataset.action;
      console.log(`Context menu action: ${action}`);
      hideContextMenu(menu);
    });
  });
}

// Show context menu for icon
function showIconContextMenu(e, icon, menu) {
  const iconName = icon.querySelector('.desktop-icon-label').textContent;
  
  menu.innerHTML = '';
  
  const openItem = document.createElement('div');
  openItem.className = 'context-menu-item';
  openItem.dataset.action = 'open';
  openItem.textContent = `Open "${iconName}"`;
  
  const sep1 = document.createElement('div');
  sep1.className = 'context-menu-separator';
  
  const getInfo = document.createElement('div');
  getInfo.className = 'context-menu-item';
  getInfo.dataset.action = 'get-info';
  getInfo.textContent = 'Get Info';
  
  const rename = document.createElement('div');
  rename.className = 'context-menu-item';
  rename.dataset.action = 'rename';
  rename.textContent = 'Rename';
  
  const sep2 = document.createElement('div');
  sep2.className = 'context-menu-separator';
  
  const deleteItem = document.createElement('div');
  deleteItem.className = 'context-menu-item';
  deleteItem.dataset.action = 'delete';
  deleteItem.textContent = 'Move to Trash';
  
  menu.appendChild(openItem);
  menu.appendChild(sep1);
  menu.appendChild(getInfo);
  menu.appendChild(rename);
  menu.appendChild(sep2);
  menu.appendChild(deleteItem);
  
  positionContextMenu(e, menu);
  menu.classList.add('visible');
  
  // Add event listeners
  menu.querySelectorAll('.context-menu-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      const action = item.dataset.action;
      if (action === 'open') {
        const iconData = desktopIcons.find(i => i.name === iconName);
        if (iconData) {
          openIcon(iconData);
        }
      } else {
        console.log(`Icon context menu action: ${action} on ${iconName}`);
      }
      hideContextMenu(menu);
    });
  });
}

// Position context menu
function positionContextMenu(e, menu) {
  const x = e.clientX;
  const y = e.clientY;
  const menuWidth = 180;
  const menuHeight = 200;
  
  // Adjust position if menu would go off screen
  const finalX = x + menuWidth > window.innerWidth ? x - menuWidth : x;
  const finalY = y + menuHeight > window.innerHeight ? y - menuHeight : y;
  
  menu.style.left = `${finalX}px`;
  menu.style.top = `${finalY}px`;
}

// Hide context menu
function hideContextMenu(menu) {
  menu.classList.remove('visible');
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initDesktop);
} else {
  initDesktop();
}

// TODO: Implement window management
// TODO: Implement Dock
// TODO: Implement menu bar
// TODO: Implement applications
