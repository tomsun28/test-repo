// Finder Application
// File browser with folder navigation, list/grid views

import './finder.css';
import { createWindow } from './window-manager.js';

// Virtual file system
const fileSystem = {
  '/': {
    type: 'folder',
    children: ['Users', 'Applications', 'Documents', 'Downloads', 'Desktop', 'Pictures', 'Music']
  },
  '/Users': {
    type: 'folder',
    children: ['admin', 'Shared'],
    modified: '2024-01-15',
    size: '--'
  },
  '/Users/admin': {
    type: 'folder',
    children: ['Documents', 'Downloads', 'Desktop', 'Pictures', 'Music', 'Movies', '.bashrc', '.zshrc'],
    modified: '2024-03-20',
    size: '--'
  },
  '/Users/Shared': {
    type: 'folder',
    children: ['Public'],
    modified: '2024-01-10',
    size: '--'
  },
  '/Users/Shared/Public': {
    type: 'folder',
    children: ['readme.txt'],
    modified: '2024-01-10',
    size: '--'
  },
  '/Users/Shared/Public/readme.txt': {
    type: 'file',
    icon: '📄',
    modified: '2024-01-10',
    size: '1 KB'
  },
  '/Users/admin/.bashrc': {
    type: 'file',
    icon: '⚙️',
    modified: '2024-02-01',
    size: '256 B'
  },
  '/Users/admin/.zshrc': {
    type: 'file',
    icon: '⚙️',
    modified: '2024-02-01',
    size: '512 B'
  },
  '/Applications': {
    type: 'folder',
    children: ['Safari.app', 'Mail.app', 'Photos.app', 'Messages.app', 'Calendar.app', 'Notes.app', 'Music.app', 'Maps.app', 'Calculator.app', 'TextEdit.app'],
    modified: '2024-03-01',
    size: '--'
  },
  '/Applications/Safari.app': { type: 'file', icon: '🧭', modified: '2024-03-01', size: '120 MB' },
  '/Applications/Mail.app': { type: 'file', icon: '📧', modified: '2024-03-01', size: '85 MB' },
  '/Applications/Photos.app': { type: 'file', icon: '🖼️', modified: '2024-03-01', size: '200 MB' },
  '/Applications/Messages.app': { type: 'file', icon: '💬', modified: '2024-03-01', size: '65 MB' },
  '/Applications/Calendar.app': { type: 'file', icon: '📅', modified: '2024-03-01', size: '45 MB' },
  '/Applications/Notes.app': { type: 'file', icon: '📝', modified: '2024-03-01', size: '55 MB' },
  '/Applications/Music.app': { type: 'file', icon: '🎵', modified: '2024-03-01', size: '180 MB' },
  '/Applications/Maps.app': { type: 'file', icon: '🗺️', modified: '2024-03-01', size: '95 MB' },
  '/Applications/Calculator.app': { type: 'file', icon: '🧮', modified: '2024-03-01', size: '12 MB' },
  '/Applications/TextEdit.app': { type: 'file', icon: '📝', modified: '2024-03-01', size: '25 MB' },
  '/Documents': {
    type: 'folder',
    children: ['Work', 'Personal', 'Projects', 'notes.txt', 'todo.md'],
    modified: '2024-03-18',
    size: '--'
  },
  '/Documents/Work': {
    type: 'folder',
    children: ['report.pdf', 'presentation.pptx', 'budget.xlsx'],
    modified: '2024-03-15',
    size: '--'
  },
  '/Documents/Work/report.pdf': { type: 'file', icon: '📕', modified: '2024-03-15', size: '2.4 MB' },
  '/Documents/Work/presentation.pptx': { type: 'file', icon: '📊', modified: '2024-03-10', size: '15 MB' },
  '/Documents/Work/budget.xlsx': { type: 'file', icon: '📗', modified: '2024-03-12', size: '800 KB' },
  '/Documents/Personal': {
    type: 'folder',
    children: ['diary.txt', 'recipes.md'],
    modified: '2024-02-28',
    size: '--'
  },
  '/Documents/Personal/diary.txt': { type: 'file', icon: '📄', modified: '2024-02-28', size: '45 KB' },
  '/Documents/Personal/recipes.md': { type: 'file', icon: '📄', modified: '2024-02-20', size: '12 KB' },
  '/Documents/Projects': {
    type: 'folder',
    children: ['web-app', 'mobile-app', 'README.md'],
    modified: '2024-03-18',
    size: '--'
  },
  '/Documents/Projects/web-app': {
    type: 'folder',
    children: ['index.html', 'style.css', 'app.js', 'package.json'],
    modified: '2024-03-18',
    size: '--'
  },
  '/Documents/Projects/web-app/index.html': { type: 'file', icon: '🌐', modified: '2024-03-18', size: '4 KB' },
  '/Documents/Projects/web-app/style.css': { type: 'file', icon: '🎨', modified: '2024-03-17', size: '8 KB' },
  '/Documents/Projects/web-app/app.js': { type: 'file', icon: '📜', modified: '2024-03-18', size: '12 KB' },
  '/Documents/Projects/web-app/package.json': { type: 'file', icon: '📦', modified: '2024-03-15', size: '1 KB' },
  '/Documents/Projects/mobile-app': {
    type: 'folder',
    children: ['App.swift', 'Info.plist'],
    modified: '2024-03-10',
    size: '--'
  },
  '/Documents/Projects/mobile-app/App.swift': { type: 'file', icon: '📜', modified: '2024-03-10', size: '25 KB' },
  '/Documents/Projects/mobile-app/Info.plist': { type: 'file', icon: '📋', modified: '2024-03-08', size: '2 KB' },
  '/Documents/Projects/README.md': { type: 'file', icon: '📄', modified: '2024-03-18', size: '3 KB' },
  '/Documents/notes.txt': { type: 'file', icon: '📄', modified: '2024-03-05', size: '2 KB' },
  '/Documents/todo.md': { type: 'file', icon: '📄', modified: '2024-03-18', size: '1 KB' },
  '/Downloads': {
    type: 'folder',
    children: ['image.png', 'archive.zip', 'installer.dmg', 'document.pdf'],
    modified: '2024-03-20',
    size: '--'
  },
  '/Downloads/image.png': { type: 'file', icon: '🖼️', modified: '2024-03-20', size: '3.2 MB' },
  '/Downloads/archive.zip': { type: 'file', icon: '📦', modified: '2024-03-19', size: '45 MB' },
  '/Downloads/installer.dmg': { type: 'file', icon: '💿', modified: '2024-03-15', size: '250 MB' },
  '/Downloads/document.pdf': { type: 'file', icon: '📕', modified: '2024-03-18', size: '1.5 MB' },
  '/Desktop': {
    type: 'folder',
    children: ['screenshot.png', 'quick-notes.txt'],
    modified: '2024-03-20',
    size: '--'
  },
  '/Desktop/screenshot.png': { type: 'file', icon: '🖼️', modified: '2024-03-20', size: '1.8 MB' },
  '/Desktop/quick-notes.txt': { type: 'file', icon: '📄', modified: '2024-03-19', size: '512 B' },
  '/Pictures': {
    type: 'folder',
    children: ['Vacation', 'Screenshots', 'wallpaper.jpg', 'profile.png'],
    modified: '2024-03-15',
    size: '--'
  },
  '/Pictures/Vacation': {
    type: 'folder',
    children: ['beach.jpg', 'sunset.jpg', 'mountains.jpg'],
    modified: '2024-02-15',
    size: '--'
  },
  '/Pictures/Vacation/beach.jpg': { type: 'file', icon: '🖼️', modified: '2024-02-15', size: '4.5 MB' },
  '/Pictures/Vacation/sunset.jpg': { type: 'file', icon: '🖼️', modified: '2024-02-15', size: '3.8 MB' },
  '/Pictures/Vacation/mountains.jpg': { type: 'file', icon: '🖼️', modified: '2024-02-14', size: '5.2 MB' },
  '/Pictures/Screenshots': {
    type: 'folder',
    children: ['screen-01.png', 'screen-02.png'],
    modified: '2024-03-10',
    size: '--'
  },
  '/Pictures/Screenshots/screen-01.png': { type: 'file', icon: '🖼️', modified: '2024-03-10', size: '800 KB' },
  '/Pictures/Screenshots/screen-02.png': { type: 'file', icon: '🖼️', modified: '2024-03-08', size: '1.2 MB' },
  '/Pictures/wallpaper.jpg': { type: 'file', icon: '🖼️', modified: '2024-01-20', size: '8 MB' },
  '/Pictures/profile.png': { type: 'file', icon: '🖼️', modified: '2024-02-01', size: '2.5 MB' },
  '/Music': {
    type: 'folder',
    children: ['Playlists', 'song.mp3', 'album.flac'],
    modified: '2024-03-10',
    size: '--'
  },
  '/Music/Playlists': {
    type: 'folder',
    children: ['favorites.m3u', 'workout.m3u'],
    modified: '2024-03-10',
    size: '--'
  },
  '/Music/Playlists/favorites.m3u': { type: 'file', icon: '🎵', modified: '2024-03-10', size: '2 KB' },
  '/Music/Playlists/workout.m3u': { type: 'file', icon: '🎵', modified: '2024-03-05', size: '1 KB' },
  '/Music/song.mp3': { type: 'file', icon: '🎵', modified: '2024-03-01', size: '8 MB' },
  '/Music/album.flac': { type: 'file', icon: '🎵', modified: '2024-02-20', size: '45 MB' },
};

// Sidebar locations
const sidebarLocations = [
  { section: 'Favorites', items: [
    { name: 'Desktop', path: '/Desktop', icon: '🖥️' },
    { name: 'Documents', path: '/Documents', icon: '📁' },
    { name: 'Downloads', path: '/Downloads', icon: '📥' },
    { name: 'Applications', path: '/Applications', icon: '📱' },
    { name: 'Pictures', path: '/Pictures', icon: '🖼️' },
    { name: 'Music', path: '/Music', icon: '🎵' },
  ]},
  { section: 'Locations', items: [
    { name: 'Macintosh HD', path: '/', icon: '💾' },
  ]}
];

/**
 * Open Finder application
 */
export function openFinder(initialPath = '/', options = {}) {
  const container = document.createElement('div');
  container.className = 'finder-container';

  // State
  const state = {
    currentPath: initialPath,
    history: [initialPath],
    historyIndex: 0,
    viewMode: 'grid', // 'grid' or 'list'
    selectedItem: null,
  };

  // Build sidebar
  const sidebar = buildSidebar(state, container);
  container.appendChild(sidebar);

  // Build main area
  const main = document.createElement('div');
  main.className = 'finder-main';

  const toolbar = buildToolbar(state, container, main);
  main.appendChild(toolbar);

  const browser = document.createElement('div');
  browser.className = 'finder-browser';
  browser.dataset.role = 'browser';
  main.appendChild(browser);

  const statusBar = document.createElement('div');
  statusBar.className = 'finder-status';
  statusBar.dataset.role = 'status';
  main.appendChild(statusBar);

  container.appendChild(main);

  // Render initial content
  renderContent(state, container);

  const win = createWindow({
    title: 'Finder',
    content: container,
    width: 750,
    height: 480,
    minWidth: 500,
    minHeight: 350,
    onClose: options.onClose,
  });

  return win;
}

/**
 * Build sidebar
 */
function buildSidebar(state, container) {
  const sidebar = document.createElement('div');
  sidebar.className = 'finder-sidebar';
  sidebar.dataset.role = 'sidebar';

  sidebarLocations.forEach(section => {
    const sectionEl = document.createElement('div');
    sectionEl.className = 'finder-sidebar-section';

    const titleEl = document.createElement('div');
    titleEl.className = 'finder-sidebar-title';
    titleEl.textContent = section.section;
    sectionEl.appendChild(titleEl);

    section.items.forEach(item => {
      const itemEl = document.createElement('div');
      itemEl.className = 'finder-sidebar-item';
      itemEl.dataset.path = item.path;

      if (state.currentPath === item.path) {
        itemEl.classList.add('active');
      }

      const iconEl = document.createElement('span');
      iconEl.className = 'finder-sidebar-icon';
      iconEl.textContent = item.icon;

      const labelEl = document.createElement('span');
      labelEl.className = 'finder-sidebar-label';
      labelEl.textContent = item.name;

      itemEl.appendChild(iconEl);
      itemEl.appendChild(labelEl);

      itemEl.addEventListener('click', () => {
        navigateTo(item.path, state, container);
      });

      sectionEl.appendChild(itemEl);
    });

    sidebar.appendChild(sectionEl);
  });

  return sidebar;
}

/**
 * Build toolbar
 */
function buildToolbar(state, container, main) {
  const toolbar = document.createElement('div');
  toolbar.className = 'finder-toolbar';

  // Navigation buttons
  const navBtns = document.createElement('div');
  navBtns.className = 'finder-nav-buttons';

  const backBtn = document.createElement('button');
  backBtn.className = 'finder-nav-btn';
  backBtn.dataset.role = 'back';
  backBtn.textContent = '◀';
  backBtn.title = 'Back';
  backBtn.disabled = state.historyIndex <= 0;
  backBtn.addEventListener('click', () => navigateBack(state, container));

  const forwardBtn = document.createElement('button');
  forwardBtn.className = 'finder-nav-btn';
  forwardBtn.dataset.role = 'forward';
  forwardBtn.textContent = '▶';
  forwardBtn.title = 'Forward';
  forwardBtn.disabled = state.historyIndex >= state.history.length - 1;
  forwardBtn.addEventListener('click', () => navigateForward(state, container));

  navBtns.appendChild(backBtn);
  navBtns.appendChild(forwardBtn);
  toolbar.appendChild(navBtns);

  // Path breadcrumb
  const pathBar = document.createElement('div');
  pathBar.className = 'finder-path';
  pathBar.dataset.role = 'path';
  toolbar.appendChild(pathBar);

  // View toggle
  const viewToggle = document.createElement('div');
  viewToggle.className = 'finder-view-toggle';

  const gridBtn = document.createElement('button');
  gridBtn.className = `finder-view-btn ${state.viewMode === 'grid' ? 'active' : ''}`;
  gridBtn.dataset.view = 'grid';
  gridBtn.textContent = '▦';
  gridBtn.title = 'Grid View';
  gridBtn.addEventListener('click', () => {
    state.viewMode = 'grid';
    updateViewToggle(viewToggle, state);
    renderContent(state, container);
  });

  const listBtn = document.createElement('button');
  listBtn.className = `finder-view-btn ${state.viewMode === 'list' ? 'active' : ''}`;
  listBtn.dataset.view = 'list';
  listBtn.textContent = '☰';
  listBtn.title = 'List View';
  listBtn.addEventListener('click', () => {
    state.viewMode = 'list';
    updateViewToggle(viewToggle, state);
    renderContent(state, container);
  });

  viewToggle.appendChild(gridBtn);
  viewToggle.appendChild(listBtn);
  toolbar.appendChild(viewToggle);

  return toolbar;
}

/**
 * Update view toggle button states
 */
function updateViewToggle(viewToggle, state) {
  viewToggle.querySelectorAll('.finder-view-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.view === state.viewMode);
  });
}

/**
 * Navigate to a path
 */
function navigateTo(path, state, container) {
  // Truncate forward history
  state.history = state.history.slice(0, state.historyIndex + 1);
  state.history.push(path);
  state.historyIndex = state.history.length - 1;
  state.currentPath = path;
  state.selectedItem = null;
  renderContent(state, container);
}

/**
 * Navigate back
 */
function navigateBack(state, container) {
  if (state.historyIndex > 0) {
    state.historyIndex--;
    state.currentPath = state.history[state.historyIndex];
    state.selectedItem = null;
    renderContent(state, container);
  }
}

/**
 * Navigate forward
 */
function navigateForward(state, container) {
  if (state.historyIndex < state.history.length - 1) {
    state.historyIndex++;
    state.currentPath = state.history[state.historyIndex];
    state.selectedItem = null;
    renderContent(state, container);
  }
}

/**
 * Render file browser content
 */
function renderContent(state, container) {
  const browser = container.querySelector('[data-role="browser"]');
  const statusBar = container.querySelector('[data-role="status"]');
  const sidebar = container.querySelector('[data-role="sidebar"]');
  const toolbar = container.querySelector('.finder-toolbar');

  // Update browser content
  browser.textContent = '';

  const folderData = fileSystem[state.currentPath];

  if (!folderData || folderData.type !== 'folder') {
    // Empty/invalid state
    const empty = document.createElement('div');
    empty.className = 'finder-empty';
    const emptyIcon = document.createElement('div');
    emptyIcon.className = 'finder-empty-icon';
    emptyIcon.textContent = '📂';
    const emptyText = document.createElement('div');
    emptyText.className = 'finder-empty-text';
    emptyText.textContent = 'This folder is empty';
    empty.appendChild(emptyIcon);
    empty.appendChild(emptyText);
    browser.appendChild(empty);
    statusBar.textContent = '0 items';
    return;
  }

  const children = folderData.children || [];

  if (children.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'finder-empty';
    const emptyIcon = document.createElement('div');
    emptyIcon.className = 'finder-empty-icon';
    emptyIcon.textContent = '📂';
    const emptyText = document.createElement('div');
    emptyText.className = 'finder-empty-text';
    emptyText.textContent = 'This folder is empty';
    empty.appendChild(emptyIcon);
    empty.appendChild(emptyText);
    browser.appendChild(empty);
    statusBar.textContent = '0 items';
  } else if (state.viewMode === 'grid') {
    renderGridView(browser, children, state, container);
    statusBar.textContent = `${children.length} item${children.length !== 1 ? 's' : ''}`;
  } else {
    renderListView(browser, children, state, container);
    statusBar.textContent = `${children.length} item${children.length !== 1 ? 's' : ''}`;
  }

  // Update sidebar active state
  sidebar.querySelectorAll('.finder-sidebar-item').forEach(item => {
    item.classList.toggle('active', item.dataset.path === state.currentPath);
  });

  // Update nav buttons
  const backBtn = toolbar.querySelector('[data-role="back"]');
  const forwardBtn = toolbar.querySelector('[data-role="forward"]');
  if (backBtn) backBtn.disabled = state.historyIndex <= 0;
  if (forwardBtn) forwardBtn.disabled = state.historyIndex >= state.history.length - 1;

  // Update path breadcrumb
  renderPathBreadcrumb(toolbar, state, container);
}

/**
 * Render grid view
 */
function renderGridView(browser, children, state, container) {
  const grid = document.createElement('div');
  grid.className = 'finder-grid';

  children.forEach(childName => {
    const childPath = state.currentPath === '/' ? `/${childName}` : `${state.currentPath}/${childName}`;
    const childData = fileSystem[childPath];
    const isFolder = childData && childData.type === 'folder';

    const item = document.createElement('div');
    item.className = 'finder-item';
    item.dataset.path = childPath;

    if (state.selectedItem === childPath) {
      item.classList.add('selected');
    }

    const iconEl = document.createElement('div');
    iconEl.className = 'finder-item-icon';
    if (isFolder) {
      iconEl.textContent = '📁';
    } else if (childData && childData.icon) {
      iconEl.textContent = childData.icon;
    } else {
      iconEl.textContent = '📄';
    }

    const nameEl = document.createElement('div');
    nameEl.className = 'finder-item-name';
    nameEl.textContent = childName;

    item.appendChild(iconEl);
    item.appendChild(nameEl);

    // Click to select
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      selectItem(item, childPath, state, container);
    });

    // Double click to open folder
    item.addEventListener('dblclick', (e) => {
      e.stopPropagation();
      if (isFolder) {
        navigateTo(childPath, state, container);
      }
    });

    grid.appendChild(item);
  });

  browser.appendChild(grid);
}

/**
 * Render list view
 */
function renderListView(browser, children, state, container) {
  const list = document.createElement('div');
  list.className = 'finder-list';

  // Header
  const header = document.createElement('div');
  header.className = 'finder-list-header';

  const nameHeader = document.createElement('div');
  nameHeader.textContent = 'Name';
  const dateHeader = document.createElement('div');
  dateHeader.textContent = 'Modified';
  const kindHeader = document.createElement('div');
  kindHeader.textContent = 'Kind';
  const sizeHeader = document.createElement('div');
  sizeHeader.textContent = 'Size';

  header.appendChild(nameHeader);
  header.appendChild(dateHeader);
  header.appendChild(kindHeader);
  header.appendChild(sizeHeader);
  list.appendChild(header);

  children.forEach(childName => {
    const childPath = state.currentPath === '/' ? `/${childName}` : `${state.currentPath}/${childName}`;
    const childData = fileSystem[childPath];
    const isFolder = childData && childData.type === 'folder';

    const item = document.createElement('div');
    item.className = 'finder-list-item';
    item.dataset.path = childPath;

    if (state.selectedItem === childPath) {
      item.classList.add('selected');
    }

    // Name column
    const nameCol = document.createElement('div');
    nameCol.className = 'finder-list-name';
    const iconEl = document.createElement('span');
    iconEl.className = 'finder-list-icon';
    if (isFolder) {
      iconEl.textContent = '📁';
    } else if (childData && childData.icon) {
      iconEl.textContent = childData.icon;
    } else {
      iconEl.textContent = '📄';
    }
    const labelEl = document.createElement('span');
    labelEl.className = 'finder-list-label';
    labelEl.textContent = childName;
    nameCol.appendChild(iconEl);
    nameCol.appendChild(labelEl);

    // Date column
    const dateCol = document.createElement('div');
    dateCol.className = 'finder-list-meta';
    dateCol.textContent = childData ? childData.modified || '--' : '--';

    // Kind column
    const kindCol = document.createElement('div');
    kindCol.className = 'finder-list-meta';
    kindCol.textContent = isFolder ? 'Folder' : getFileKind(childName);

    // Size column
    const sizeCol = document.createElement('div');
    sizeCol.className = 'finder-list-meta';
    sizeCol.textContent = childData ? childData.size || '--' : '--';

    item.appendChild(nameCol);
    item.appendChild(dateCol);
    item.appendChild(kindCol);
    item.appendChild(sizeCol);

    // Click to select
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      selectItem(item, childPath, state, container);
    });

    // Double click to open folder
    item.addEventListener('dblclick', (e) => {
      e.stopPropagation();
      if (isFolder) {
        navigateTo(childPath, state, container);
      }
    });

    list.appendChild(item);
  });

  browser.appendChild(list);
}

/**
 * Select an item
 */
function selectItem(itemEl, path, state, container) {
  // Deselect all
  container.querySelectorAll('.finder-item, .finder-list-item').forEach(el => {
    el.classList.remove('selected');
  });
  itemEl.classList.add('selected');
  state.selectedItem = path;

  // Update status bar
  const statusBar = container.querySelector('[data-role="status"]');
  const data = fileSystem[path];
  if (data && data.type === 'file') {
    const name = path.split('/').pop();
    statusBar.textContent = `${name} — ${data.size || '--'}`;
  }
}

/**
 * Render path breadcrumb
 */
function renderPathBreadcrumb(toolbar, state, container) {
  const pathBar = toolbar.querySelector('[data-role="path"]');
  pathBar.textContent = '';

  const parts = state.currentPath.split('/').filter(Boolean);

  // Root segment
  const rootSegment = document.createElement('span');
  rootSegment.className = 'finder-path-segment';
  rootSegment.textContent = '💾 Macintosh HD';
  rootSegment.addEventListener('click', () => {
    navigateTo('/', state, container);
  });
  pathBar.appendChild(rootSegment);

  let currentBuild = '';
  parts.forEach(part => {
    currentBuild += '/' + part;

    const sep = document.createElement('span');
    sep.className = 'finder-path-separator';
    sep.textContent = '›';
    pathBar.appendChild(sep);

    const segment = document.createElement('span');
    segment.className = 'finder-path-segment';
    segment.textContent = part;
    const pathCopy = currentBuild;
    segment.addEventListener('click', () => {
      navigateTo(pathCopy, state, container);
    });
    pathBar.appendChild(segment);
  });
}

/**
 * Get file kind from extension
 */
function getFileKind(filename) {
  const ext = filename.split('.').pop().toLowerCase();
  const kinds = {
    'txt': 'Text Document',
    'md': 'Markdown Document',
    'pdf': 'PDF Document',
    'pptx': 'Presentation',
    'xlsx': 'Spreadsheet',
    'html': 'HTML Document',
    'css': 'Style Sheet',
    'js': 'JavaScript',
    'swift': 'Swift Source',
    'json': 'JSON File',
    'png': 'PNG Image',
    'jpg': 'JPEG Image',
    'jpeg': 'JPEG Image',
    'mp3': 'MP3 Audio',
    'flac': 'FLAC Audio',
    'm3u': 'Playlist',
    'zip': 'ZIP Archive',
    'dmg': 'Disk Image',
    'app': 'Application',
    'plist': 'Property List',
    'bashrc': 'Shell Config',
    'zshrc': 'Shell Config',
  };
  return kinds[ext] || 'Document';
}
