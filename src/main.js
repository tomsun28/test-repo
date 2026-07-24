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
  
  icon.innerHTML = `
    <div class="desktop-icon-image">${iconData.icon}</div>
    <div class="desktop-icon-label">${iconData.name}</div>
  `;
  
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
  createWindow({
    title: iconData.name,
    content: `<div style="display:flex;align-items:center;justify-content:center;height:100%;flex-direction:column;gap:12px;"><div style="font-size:64px;">${iconData.icon}</div><div style="font-size:16px;color:#666;">${iconData.name}</div></div>`,
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
  
  menu.innerHTML = `
    <div class="context-menu-item" data-action="open">Open "${iconName}"</div>
    <div class="context-menu-separator"></div>
    <div class="context-menu-item" data-action="get-info">Get Info</div>
    <div class="context-menu-item" data-action="rename">Rename</div>
    <div class="context-menu-separator"></div>
    <div class="context-menu-item" data-action="delete">Move to Trash</div>
  `;
  
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
