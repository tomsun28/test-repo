// Finder Application
// File browser with folder navigation and list/grid views

import './finder.css';
import { createWindow } from './window-manager.js';

// Virtual file system structure
const fileSystem = {
  '/': {
    type: 'folder',
    children: {
      'Desktop': {
        type: 'folder',
        modified: '2024-01-15',
        size: '--',
        children: {
          'Screenshot 2024-01-15.png': { type: 'file', modified: '2024-01-15', size: '2.4 MB' },
          'Notes.txt': { type: 'file', modified: '2024-01-14', size: '1 KB' },
        }
      },
      'Documents': {
        type: 'folder',
        modified: '2024-01-14',
        size: '--',
        children: {
          'Work': {
            type: 'folder',
            modified: '2024-01-14',
            size: '--',
            children: {
              'Project Proposal.docx': { type: 'file', modified: '2024-01-14', size: '156 KB' },
              'Budget 2024.xlsx': { type: 'file', modified: '2024-01-10', size: '89 KB' },
              'Meeting Notes.md': { type: 'file', modified: '2024-01-12', size: '12 KB' },
            }
          },
          'Personal': {
            type: 'folder',
            modified: '2024-01-13',
            size: '--',
            children: {
              'Resume.pdf': { type: 'file', modified: '2024-01-13', size: '245 KB' },
              'Cover Letter.docx': { type: 'file', modified: '2024-01-12', size: '67 KB' },
            }
          },
          'README.md': { type: 'file', modified: '2024-01-10', size: '3 KB' },
        }
      },
      'Downloads': {
        type: 'folder',
        modified: '2024-01-15',
        size: '--',
        children: {
          'installer.dmg': { type: 'file', modified: '2024-01-15', size: '156 MB' },
          'photo.jpg': { type: 'file', modified: '2024-01-14', size: '3.2 MB' },
          'archive.zip': { type: 'file', modified: '2024-01-13', size: '45 MB' },
          'video.mp4': { type: 'file', modified: '2024-01-12', size: '234 MB' },
        }
      },
      'Applications': {
        type: 'folder',
        modified: '2024-01-10',
        size: '--',
        children: {
          'Safari.app': { type: 'file', modified: '2024-01-10', size: '45 MB' },
          'Mail.app': { type: 'file', modified: '2024-01-10', size: '38 MB' },
          'Photos.app': { type: 'file', modified: '2024-01-10', size: '67 MB' },
          'Music.app': { type: 'file', modified: '2024-01-10', size: '52 MB' },
          'Calculator.app': { type: 'file', modified: '2024-01-10', size: '12 MB' },
        }
      },
      'Pictures': {
        type: 'folder',
        modified: '2024-01-14',
        size: '--',
        children: {
          'Vacation 2024': {
            type: 'folder',
            modified: '2024-01-14',
            size: '--',
            children: {
              'beach.jpg': { type: 'file', modified: '2024-01-14', size: '4.5 MB' },
              'sunset.jpg': { type: 'file', modified: '2024-01-14', size: '3.8 MB' },
              'mountain.jpg': { type: 'file', modified: '2024-01-14', size: '5.2 MB' },
            }
          },
          'Screenshots': {
            type: 'folder',
            modified: '2024-01-15',
            size: '--',
            children: {
              'Screenshot 1.png': { type: 'file', modified: '2024-01-15', size: '1.2 MB' },
              'Screenshot 2.png': { type: 'file', modified: '2024-01-14', size: '980 KB' },
            }
          },
        }
      },
      'Music': {
        type: 'folder',
        modified: '2024-01-12',
        size: '--',
        children: {
          'playlist.m3u': { type: 'file', modified: '2024-01-12', size: '2 KB' },
        }
      },
    }
  }
};

// Get file/folder icon based on type and name
function getFileIcon(name, type) {
  if (type === 'folder') return '📁';
  
  const ext = name.split('.').pop().toLowerCase();
  const iconMap = {
    'txt': '📄', 'md': '📝', 'doc': '📄', 'docx': '📄',
    'pdf': '📕', 'xls': '📊', 'xlsx': '📊',
    'jpg': '🖼️', 'jpeg': '🖼️', 'png': '🖼️', 'gif': '🖼️',
    'mp4': '🎬', 'mov': '🎬', 'avi': '🎬',
    'mp3': '🎵', 'wav': '🎵', 'm3u': '🎵',
    'zip': '🗜️', 'rar': '🗜️', 'tar': '🗜️', 'gz': '🗜️',
    'dmg': '💿', 'iso': '💿',
    'app': '📱',
  };
  
  return iconMap[ext] || '📄';
}

// Navigate to a path in the file system
function navigateToPath(path) {
  const parts = path.split('/').filter(p => p !== '');
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

// Create Finder window
export function openFinder(initialPath = '/') {
  let currentPath = initialPath;
  let viewMode = 'grid'; // 'grid' or 'list'
  let history = [initialPath];
  let historyIndex = 0;
  
  const content = document.createElement('div');
  content.className = 'finder-container';
  
  // Sidebar
  const sidebar = document.createElement('div');
  sidebar.className = 'finder-sidebar';
  
  const sidebarItems = [
    { name: 'Desktop', path: '/Desktop', icon: '🖥️' },
    { name: 'Documents', path: '/Documents', icon: '📄' },
    { name: 'Downloads', path: '/Downloads', icon: '📥' },
    { name: 'Applications', path: '/Applications', icon: '📱' },
    { name: 'Pictures', path: '/Pictures', icon: '🖼️' },
    { name: 'Music', path: '/Music', icon: '🎵' },
  ];
  
  sidebarItems.forEach(item => {
    const sidebarItem = document.createElement('div');
    sidebarItem.className = 'finder-sidebar-item';
    
    const iconSpan = document.createElement('span');
    iconSpan.className = 'sidebar-icon';
    iconSpan.textContent = item.icon;
    
    const nameSpan = document.createElement('span');
    nameSpan.className = 'sidebar-name';
    nameSpan.textContent = item.name;
    
    sidebarItem.appendChild(iconSpan);
    sidebarItem.appendChild(nameSpan);
    
    sidebarItem.addEventListener('click', () => {
      navigateTo(item.path);
    });
    sidebar.appendChild(sidebarItem);
  });
  
  // Main content area
  const mainArea = document.createElement('div');
  mainArea.className = 'finder-main';
  
  // Toolbar
  const toolbar = document.createElement('div');
  toolbar.className = 'finder-toolbar';
  
  const navButtons = document.createElement('div');
  navButtons.className = 'finder-nav-buttons';
  
  const backBtn = document.createElement('button');
  backBtn.className = 'finder-nav-btn';
  backBtn.textContent = '◀';
  backBtn.title = 'Back';
  backBtn.disabled = true;
  backBtn.addEventListener('click', () => {
    if (historyIndex > 0) {
      historyIndex--;
      currentPath = history[historyIndex];
      updateView();
    }
  });
  
  const forwardBtn = document.createElement('button');
  forwardBtn.className = 'finder-nav-btn';
  forwardBtn.textContent = '▶';
  forwardBtn.title = 'Forward';
  forwardBtn.disabled = true;
  forwardBtn.addEventListener('click', () => {
    if (historyIndex < history.length - 1) {
      historyIndex++;
      currentPath = history[historyIndex];
      updateView();
    }
  });
  
  navButtons.appendChild(backBtn);
  navButtons.appendChild(forwardBtn);
  
  const pathDisplay = document.createElement('div');
  pathDisplay.className = 'finder-path';
  pathDisplay.textContent = currentPath;
  
  const viewToggle = document.createElement('div');
  viewToggle.className = 'finder-view-toggle';
  
  const gridBtn = document.createElement('button');
  gridBtn.className = 'finder-view-btn active';
  gridBtn.textContent = '⊞';
  gridBtn.title = 'Grid View';
  gridBtn.addEventListener('click', () => {
    viewMode = 'grid';
    gridBtn.classList.add('active');
    listBtn.classList.remove('active');
    updateView();
  });
  
  const listBtn = document.createElement('button');
  listBtn.className = 'finder-view-btn';
  listBtn.textContent = '☰';
  listBtn.title = 'List View';
  listBtn.addEventListener('click', () => {
    viewMode = 'list';
    listBtn.classList.add('active');
    gridBtn.classList.remove('active');
    updateView();
  });
  
  viewToggle.appendChild(gridBtn);
  viewToggle.appendChild(listBtn);
  
  toolbar.appendChild(navButtons);
  toolbar.appendChild(pathDisplay);
  toolbar.appendChild(viewToggle);
  
  // Content view
  const contentView = document.createElement('div');
  contentView.className = 'finder-content';
  
  mainArea.appendChild(toolbar);
  mainArea.appendChild(contentView);
  
  content.appendChild(sidebar);
  content.appendChild(mainArea);
  
  // Navigate to a new path
  function navigateTo(path) {
    currentPath = path;
    
    // Update history
    if (history[historyIndex] !== path) {
      history = history.slice(0, historyIndex + 1);
      history.push(path);
      historyIndex = history.length - 1;
    }
    
    updateView();
  }
  
  // Update the view
  function updateView() {
    const node = navigateToPath(currentPath);
    
    if (!node || node.type !== 'folder') {
      contentView.textContent = '';
      const emptyDiv = document.createElement('div');
      emptyDiv.className = 'finder-empty';
      emptyDiv.textContent = 'Folder not found';
      contentView.appendChild(emptyDiv);
      return;
    }
    
    // Update path display
    pathDisplay.textContent = currentPath;
    
    // Update navigation buttons
    backBtn.disabled = historyIndex === 0;
    forwardBtn.disabled = historyIndex === history.length - 1;
    
    // Update sidebar selection
    sidebar.querySelectorAll('.finder-sidebar-item').forEach(item => {
      item.classList.remove('active');
    });
    const activeSidebarItem = Array.from(sidebar.querySelectorAll('.finder-sidebar-item'))
      .find(item => item.querySelector('.sidebar-name').textContent === currentPath.split('/')[1]);
    if (activeSidebarItem) {
      activeSidebarItem.classList.add('active');
    }
    
    // Clear content
    while (contentView.firstChild) {
      contentView.removeChild(contentView.firstChild);
    }
    
    const children = node.children || {};
    const items = Object.entries(children);
    
    if (items.length === 0) {
      contentView.textContent = '';
      const emptyDiv = document.createElement('div');
      emptyDiv.className = 'finder-empty';
      emptyDiv.textContent = 'This folder is empty';
      contentView.appendChild(emptyDiv);
      return;
    }
    
    // Sort: folders first, then files
    items.sort((a, b) => {
      if (a[1].type === b[1].type) {
        return a[0].localeCompare(b[0]);
      }
      return a[1].type === 'folder' ? -1 : 1;
    });
    
    if (viewMode === 'grid') {
      contentView.classList.add('grid-view');
      contentView.classList.remove('list-view');
      renderGridView(contentView, items);
    } else {
      contentView.classList.add('list-view');
      contentView.classList.remove('grid-view');
      renderListView(contentView, items);
    }
  }
  
  // Render grid view
  function renderGridView(container, items) {
    const grid = document.createElement('div');
    grid.className = 'finder-grid';
    
    items.forEach(([name, data]) => {
      const item = document.createElement('div');
      item.className = 'finder-grid-item';
      
      const iconDiv = document.createElement('div');
      iconDiv.className = 'finder-item-icon';
      iconDiv.textContent = getFileIcon(name, data.type);
      
      const nameDiv = document.createElement('div');
      nameDiv.className = 'finder-item-name';
      nameDiv.title = name;
      nameDiv.textContent = name;
      
      item.appendChild(iconDiv);
      item.appendChild(nameDiv);
      
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        container.querySelectorAll('.finder-grid-item').forEach(i => i.classList.remove('selected'));
        item.classList.add('selected');
      });
      
      item.addEventListener('dblclick', () => {
        if (data.type === 'folder') {
          const newPath = currentPath === '/' ? `/${name}` : `${currentPath}/${name}`;
          navigateTo(newPath);
        } else {
          console.log(`Opening file: ${name}`);
        }
      });
      
      grid.appendChild(item);
    });
    
    container.appendChild(grid);
  }
  
  // Render list view
  function renderListView(container, items) {
    const list = document.createElement('div');
    list.className = 'finder-list';
    
    // Header
    const header = document.createElement('div');
    header.className = 'finder-list-header';
    const hName = document.createElement('div');
    hName.className = 'finder-list-col name';
    hName.textContent = 'Name';
    const hMod = document.createElement('div');
    hMod.className = 'finder-list-col modified';
    hMod.textContent = 'Date Modified';
    const hSize = document.createElement('div');
    hSize.className = 'finder-list-col size';
    hSize.textContent = 'Size';
    header.appendChild(hName);
    header.appendChild(hMod);
    header.appendChild(hSize);
    list.appendChild(header);
    
    items.forEach(([name, data]) => {
      const item = document.createElement('div');
      item.className = 'finder-list-item';
      
      const nameCol = document.createElement('div');
      nameCol.className = 'finder-list-col name';
      const iconSpan = document.createElement('span');
      iconSpan.className = 'finder-item-icon';
      iconSpan.textContent = getFileIcon(name, data.type);
      const nameSpan = document.createElement('span');
      nameSpan.className = 'finder-item-name';
      nameSpan.textContent = name;
      nameCol.appendChild(iconSpan);
      nameCol.appendChild(nameSpan);
      
      const modCol = document.createElement('div');
      modCol.className = 'finder-list-col modified';
      modCol.textContent = data.modified || '--';
      
      const sizeCol = document.createElement('div');
      sizeCol.className = 'finder-list-col size';
      sizeCol.textContent = data.size || '--';
      
      item.appendChild(nameCol);
      item.appendChild(modCol);
      item.appendChild(sizeCol);
      
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        container.querySelectorAll('.finder-list-item').forEach(i => i.classList.remove('selected'));
        item.classList.add('selected');
      });
      
      item.addEventListener('dblclick', () => {
        if (data.type === 'folder') {
          const newPath = currentPath === '/' ? `/${name}` : `${currentPath}/${name}`;
          navigateTo(newPath);
        } else {
          console.log(`Opening file: ${name}`);
        }
      });
      
      list.appendChild(item);
    });
    
    container.appendChild(list);
  }
  
  // Initial render
  updateView();
  
  // Create window
  const win = createWindow({
    title: 'Finder',
    width: 800,
    height: 500,
    minWidth: 600,
    minHeight: 400,
    content: content,
  });
  
  return win;
}
