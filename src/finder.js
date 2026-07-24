// Finder Application
// File browser with folder navigation and list/grid view support

import './finder.css';
import { createWindow } from './window-manager.js';

// Virtual file system structure
const fileSystem = {
  '/': {
    type: 'folder',
    name: 'Macintosh HD',
    children: {
      'Applications': {
        type: 'folder',
        name: 'Applications',
        modified: '2026-07-20',
        children: {
          'Safari.app': { type: 'file', name: 'Safari.app', size: '245 MB', modified: '2026-07-15', icon: '🧭' },
          'Mail.app': { type: 'file', name: 'Mail.app', size: '128 MB', modified: '2026-07-10', icon: '📧' },
          'Photos.app': { type: 'file', name: 'Photos.app', size: '312 MB', modified: '2026-07-12', icon: '🖼️' },
          'Music.app': { type: 'file', name: 'Music.app', size: '198 MB', modified: '2026-07-08', icon: '🎵' },
          'Calendar.app': { type: 'file', name: 'Calendar.app', size: '89 MB', modified: '2026-07-05', icon: '📅' },
          'Notes.app': { type: 'file', name: 'Notes.app', size: '67 MB', modified: '2026-07-03', icon: '📝' },
        }
      },
      'Documents': {
        type: 'folder',
        name: 'Documents',
        modified: '2026-07-22',
        children: {
          'Work': {
            type: 'folder',
            name: 'Work',
            modified: '2026-07-21',
            children: {
              'project-proposal.docx': { type: 'file', name: 'project-proposal.docx', size: '2.4 MB', modified: '2026-07-21', icon: '📄' },
              'budget-2026.xlsx': { type: 'file', name: 'budget-2026.xlsx', size: '1.8 MB', modified: '2026-07-19', icon: '📊' },
              'meeting-notes.txt': { type: 'file', name: 'meeting-notes.txt', size: '24 KB', modified: '2026-07-20', icon: '📝' },
            }
          },
          'Personal': {
            type: 'folder',
            name: 'Personal',
            modified: '2026-07-18',
            children: {
              'resume.pdf': { type: 'file', name: 'resume.pdf', size: '342 KB', modified: '2026-07-18', icon: '📄' },
              'cover-letter.docx': { type: 'file', name: 'cover-letter.docx', size: '156 KB', modified: '2026-07-17', icon: '📄' },
            }
          },
          'readme.md': { type: 'file', name: 'readme.md', size: '8 KB', modified: '2026-07-15', icon: '📄' },
        }
      },
      'Downloads': {
        type: 'folder',
        name: 'Downloads',
        modified: '2026-07-23',
        children: {
          'installer.dmg': { type: 'file', name: 'installer.dmg', size: '456 MB', modified: '2026-07-23', icon: '💿' },
          'photo-001.jpg': { type: 'file', name: 'photo-001.jpg', size: '3.2 MB', modified: '2026-07-22', icon: '🖼️' },
          'document.pdf': { type: 'file', name: 'document.pdf', size: '1.5 MB', modified: '2026-07-21', icon: '📄' },
          'archive.zip': { type: 'file', name: 'archive.zip', size: '78 MB', modified: '2026-07-20', icon: '📦' },
        }
      },
      'Pictures': {
        type: 'folder',
        name: 'Pictures',
        modified: '2026-07-19',
        children: {
          'Vacation': {
            type: 'folder',
            name: 'Vacation',
            modified: '2026-07-19',
            children: {
              'beach.jpg': { type: 'file', name: 'beach.jpg', size: '4.5 MB', modified: '2026-07-19', icon: '🖼️' },
              'sunset.jpg': { type: 'file', name: 'sunset.jpg', size: '3.8 MB', modified: '2026-07-19', icon: '🖼️' },
              'mountains.jpg': { type: 'file', name: 'mountains.jpg', size: '5.2 MB', modified: '2026-07-19', icon: '🖼️' },
            }
          },
          'Screenshots': {
            type: 'folder',
            name: 'Screenshots',
            modified: '2026-07-18',
            children: {
              'screenshot-001.png': { type: 'file', name: 'screenshot-001.png', size: '1.2 MB', modified: '2026-07-18', icon: '🖼️' },
              'screenshot-002.png': { type: 'file', name: 'screenshot-002.png', size: '980 KB', modified: '2026-07-17', icon: '🖼️' },
            }
          },
        }
      },
      'Music': {
        type: 'folder',
        name: 'Music',
        modified: '2026-07-16',
        children: {
          'playlist.m3u': { type: 'file', name: 'playlist.m3u', size: '2 KB', modified: '2026-07-16', icon: '🎵' },
          'song1.mp3': { type: 'file', name: 'song1.mp3', size: '8.5 MB', modified: '2026-07-15', icon: '🎵' },
          'song2.mp3': { type: 'file', name: 'song2.mp3', size: '7.2 MB', modified: '2026-07-14', icon: '🎵' },
        }
      },
    }
  }
};

let currentPath = '/';
let currentView = 'list'; // 'list' or 'grid'
let navigationHistory = ['/'];
let historyIndex = 0;

/**
 * Open Finder application
 */
export function openFinder() {
  const finderContent = createFinderUI();
  
  const win = createWindow({
    title: 'Finder',
    width: 800,
    height: 500,
    content: finderContent,
  });

  // Initialize with root directory
  navigateTo('/');
  
  return win;
}

/**
 * Create Finder UI
 */
function createFinderUI() {
  const container = document.createElement('div');
  container.className = 'finder-container';

  // Toolbar
  const toolbar = createToolbar();
  container.appendChild(toolbar);

  // Main content area
  const mainArea = document.createElement('div');
  mainArea.className = 'finder-main';

  // Sidebar
  const sidebar = createSidebar();
  mainArea.appendChild(sidebar);

  // File browser
  const fileBrowser = createFileBrowser();
  mainArea.appendChild(fileBrowser);

  container.appendChild(mainArea);

  // Status bar
  const statusBar = createStatusBar();
  container.appendChild(statusBar);

  return container;
}

/**
 * Create toolbar with navigation and view controls
 */
function createToolbar() {
  const toolbar = document.createElement('div');
  toolbar.className = 'finder-toolbar';

  // Navigation buttons
  const navGroup = document.createElement('div');
  navGroup.className = 'toolbar-group';

  const backBtn = document.createElement('button');
  backBtn.className = 'toolbar-btn';
  backBtn.innerHTML = '◀';
  backBtn.title = 'Back';
  backBtn.addEventListener('click', () => navigateBack());

  const forwardBtn = document.createElement('button');
  forwardBtn.className = 'toolbar-btn';
  forwardBtn.innerHTML = '▶';
  forwardBtn.title = 'Forward';
  forwardBtn.addEventListener('click', () => navigateForward());

  navGroup.appendChild(backBtn);
  navGroup.appendChild(forwardBtn);

  // Path breadcrumb
  const pathDisplay = document.createElement('div');
  pathDisplay.className = 'toolbar-path';
  pathDisplay.id = 'finder-path';

  // View toggle
  const viewGroup = document.createElement('div');
  viewGroup.className = 'toolbar-group';

  const listViewBtn = document.createElement('button');
  listViewBtn.className = 'toolbar-btn view-btn active';
  listViewBtn.innerHTML = '☰';
  listViewBtn.title = 'List View';
  listViewBtn.dataset.view = 'list';
  listViewBtn.addEventListener('click', () => switchView('list'));

  const gridViewBtn = document.createElement('button');
  gridViewBtn.className = 'toolbar-btn view-btn';
  gridViewBtn.innerHTML = '⊞';
  gridViewBtn.title = 'Grid View';
  gridViewBtn.dataset.view = 'grid';
  gridViewBtn.addEventListener('click', () => switchView('grid'));

  viewGroup.appendChild(listViewBtn);
  viewGroup.appendChild(gridViewBtn);

  toolbar.appendChild(navGroup);
  toolbar.appendChild(pathDisplay);
  toolbar.appendChild(viewGroup);

  return toolbar;
}

/**
 * Create sidebar with quick access locations
 */
function createSidebar() {
  const sidebar = document.createElement('div');
  sidebar.className = 'finder-sidebar';

  const favorites = document.createElement('div');
  favorites.className = 'sidebar-section';

  const favoritesTitle = document.createElement('div');
  favoritesTitle.className = 'sidebar-title';
  favoritesTitle.textContent = 'Favorites';

  favorites.appendChild(favoritesTitle);

  const sidebarItems = [
    { name: 'Recents', icon: '🕐', path: '/' },
    { name: 'Applications', icon: '📱', path: '/Applications' },
    { name: 'Documents', icon: '📁', path: '/Documents' },
    { name: 'Downloads', icon: '📥', path: '/Downloads' },
    { name: 'Pictures', icon: '🖼️', path: '/Pictures' },
    { name: 'Music', icon: '🎵', path: '/Music' },
  ];

  sidebarItems.forEach(item => {
    const sidebarItem = document.createElement('div');
    sidebarItem.className = 'sidebar-item';
    sidebarItem.dataset.path = item.path;
    sidebarItem.innerHTML = `
      <span class="sidebar-icon">${item.icon}</span>
      <span class="sidebar-label">${item.name}</span>
    `;
    sidebarItem.addEventListener('click', () => navigateTo(item.path));
    favorites.appendChild(sidebarItem);
  });

  sidebar.appendChild(favorites);

  return sidebar;
}

/**
 * Create file browser area
 */
function createFileBrowser() {
  const browser = document.createElement('div');
  browser.className = 'finder-browser';
  browser.id = 'finder-browser';
  return browser;
}

/**
 * Create status bar
 */
function createStatusBar() {
  const statusBar = document.createElement('div');
  statusBar.className = 'finder-statusbar';
  statusBar.id = 'finder-statusbar';
  statusBar.textContent = '0 items';
  return statusBar;
}

/**
 * Navigate to a path
 */
function navigateTo(path) {
  currentPath = path;
  
  // Update history
  if (historyIndex < navigationHistory.length - 1) {
    navigationHistory = navigationHistory.slice(0, historyIndex + 1);
  }
  if (navigationHistory[navigationHistory.length - 1] !== path) {
    navigationHistory.push(path);
    historyIndex = navigationHistory.length - 1;
  }

  renderCurrentDirectory();
  updatePathDisplay();
  updateSidebarSelection();
}

/**
 * Navigate back in history
 */
function navigateBack() {
  if (historyIndex > 0) {
    historyIndex--;
    currentPath = navigationHistory[historyIndex];
    renderCurrentDirectory();
    updatePathDisplay();
    updateSidebarSelection();
  }
}

/**
 * Navigate forward in history
 */
function navigateForward() {
  if (historyIndex < navigationHistory.length - 1) {
    historyIndex++;
    currentPath = navigationHistory[historyIndex];
    renderCurrentDirectory();
    updatePathDisplay();
    updateSidebarSelection();
  }
}

/**
 * Get folder at path
 */
function getFolderAtPath(path) {
  if (path === '/') {
    return fileSystem['/'];
  }

  const parts = path.split('/').filter(p => p);
  let current = fileSystem['/'];

  for (const part of parts) {
    if (current.children && current.children[part]) {
      current = current.children[part];
    } else {
      return null;
    }
  }

  return current;
}

/**
 * Render current directory contents
 */
function renderCurrentDirectory() {
  const browser = document.getElementById('finder-browser');
  if (!browser) return;

  browser.innerHTML = '';

  const folder = getFolderAtPath(currentPath);
  if (!folder || !folder.children) {
    browser.innerHTML = '<div class="finder-empty">Folder is empty</div>';
    updateStatusBar(0);
    return;
  }

  const items = Object.values(folder.children);
  
  if (items.length === 0) {
    browser.innerHTML = '<div class="finder-empty">Folder is empty</div>';
    updateStatusBar(0);
    return;
  }

  if (currentView === 'list') {
    renderListView(browser, items);
  } else {
    renderGridView(browser, items);
  }

  updateStatusBar(items.length);
}

/**
 * Render list view
 */
function renderListView(container, items) {
  const list = document.createElement('div');
  list.className = 'finder-list';

  // Header
  const header = document.createElement('div');
  header.className = 'finder-list-header';
  header.innerHTML = `
    <div class="list-col-name">Name</div>
    <div class="list-col-modified">Date Modified</div>
    <div class="list-col-size">Size</div>
  `;
  list.appendChild(header);

  // Sort items: folders first, then files
  const sortedItems = items.sort((a, b) => {
    if (a.type === 'folder' && b.type !== 'folder') return -1;
    if (a.type !== 'folder' && b.type === 'folder') return 1;
    return a.name.localeCompare(b.name);
  });

  sortedItems.forEach(item => {
    const row = document.createElement('div');
    row.className = 'finder-list-row';
    row.dataset.type = item.type;

    const icon = item.type === 'folder' ? '📁' : (item.icon || '📄');
    
    row.innerHTML = `
      <div class="list-col-name">
        <span class="item-icon">${icon}</span>
        <span class="item-name">${item.name}</span>
      </div>
      <div class="list-col-modified">${item.modified || '-'}</div>
      <div class="list-col-size">${item.type === 'folder' ? '--' : (item.size || '-')}</div>
    `;

    row.addEventListener('click', (e) => {
      e.stopPropagation();
      selectItem(row);
    });

    row.addEventListener('dblclick', (e) => {
      e.stopPropagation();
      openItem(item);
    });

    list.appendChild(row);
  });

  container.appendChild(list);
}

/**
 * Render grid view
 */
function renderGridView(container, items) {
  const grid = document.createElement('div');
  grid.className = 'finder-grid';

  // Sort items: folders first, then files
  const sortedItems = items.sort((a, b) => {
    if (a.type === 'folder' && b.type !== 'folder') return -1;
    if (a.type !== 'folder' && b.type === 'folder') return 1;
    return a.name.localeCompare(b.name);
  });

  sortedItems.forEach(item => {
    const gridItem = document.createElement('div');
    gridItem.className = 'finder-grid-item';
    gridItem.dataset.type = item.type;

    const icon = item.type === 'folder' ? '📁' : (item.icon || '📄');
    
    gridItem.innerHTML = `
      <div class="grid-item-icon">${icon}</div>
      <div class="grid-item-name">${item.name}</div>
    `;

    gridItem.addEventListener('click', (e) => {
      e.stopPropagation();
      selectItem(gridItem);
    });

    gridItem.addEventListener('dblclick', (e) => {
      e.stopPropagation();
      openItem(item);
    });

    grid.appendChild(gridItem);
  });

  container.appendChild(grid);
}

/**
 * Select an item
 */
function selectItem(element) {
  const browser = document.getElementById('finder-browser');
  browser.querySelectorAll('.selected').forEach(el => el.classList.remove('selected'));
  element.classList.add('selected');
}

/**
 * Open an item (navigate to folder or open file)
 */
function openItem(item) {
  if (item.type === 'folder') {
    const newPath = currentPath === '/' ? `/${item.name}` : `${currentPath}/${item.name}`;
    navigateTo(newPath);
  } else {
    console.log(`Opening file: ${item.name}`);
    // For now, just log - could be extended to open files in appropriate apps
  }
}

/**
 * Switch between list and grid view
 */
function switchView(view) {
  currentView = view;

  // Update toolbar buttons
  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.view === view);
  });

  renderCurrentDirectory();
}

/**
 * Update path display in toolbar
 */
function updatePathDisplay() {
  const pathDisplay = document.getElementById('finder-path');
  if (!pathDisplay) return;

  const parts = currentPath.split('/').filter(p => p);
  let displayPath = 'Macintosh HD';
  
  if (parts.length > 0) {
    displayPath = 'Macintosh HD > ' + parts.join(' > ');
  }

  pathDisplay.textContent = displayPath;
}

/**
 * Update sidebar selection
 */
function updateSidebarSelection() {
  document.querySelectorAll('.sidebar-item').forEach(item => {
    const itemPath = item.dataset.path;
    item.classList.toggle('active', itemPath === currentPath);
  });
}

/**
 * Update status bar
 */
function updateStatusBar(itemCount) {
  const statusBar = document.getElementById('finder-statusbar');
  if (statusBar) {
    statusBar.textContent = `${itemCount} item${itemCount !== 1 ? 's' : ''}`;
  }
}
