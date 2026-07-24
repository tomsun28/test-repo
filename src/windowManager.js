// Window Management System

let windowZIndex = 100;
let activeWindow = null;
let windowCounter = 0;

export function createWindow(options = {}) {
  const {
    title = 'Untitled',
    width = 600,
    height = 400,
    x = 100 + windowCounter * 30,
    y = 100 + windowCounter * 30,
    content = '',
    minWidth = 300,
    minHeight = 200
  } = options;

  windowCounter++;
  const windowId = `window-${windowCounter}`;

  const windowEl = document.createElement('div');
  windowEl.className = 'mac-window';
  windowEl.id = windowId;
  windowEl.style.width = `${width}px`;
  windowEl.style.height = `${height}px`;
  windowEl.style.left = `${x}px`;
  windowEl.style.top = `${y}px`;
  windowEl.style.minWidth = `${minWidth}px`;
  windowEl.style.minHeight = `${minHeight}px`;

  windowEl.innerHTML = `
    <div class="window-titlebar">
      <div class="window-controls">
        <button class="window-control close" title="Close"></button>
        <button class="window-control minimize" title="Minimize"></button>
        <button class="window-control maximize" title="Maximize"></button>
      </div>
      <div class="window-title">${title}</div>
    </div>
    <div class="window-content">${content}</div>
    <div class="window-resize-handle"></div>
  `;

  document.getElementById('desktop').appendChild(windowEl);

  // Initialize behaviors
  initWindowDrag(windowEl);
  initWindowResize(windowEl);
  initWindowControls(windowEl, options);
  focusWindow(windowEl);

  return windowEl;
}

function initWindowDrag(windowEl) {
  const titlebar = windowEl.querySelector('.window-titlebar');
  let isDragging = false;
  let startX, startY, initialX, initialY;

  titlebar.addEventListener('mousedown', (e) => {
    if (e.target.closest('.window-control')) return;
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    initialX = windowEl.offsetLeft;
    initialY = windowEl.offsetTop;
    focusWindow(windowEl);
    document.body.style.userSelect = 'none';
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    windowEl.style.left = `${initialX + dx}px`;
    windowEl.style.top = `${initialY + dy}px`;
  });

  document.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      document.body.style.userSelect = '';
    }
  });
}

function initWindowResize(windowEl) {
  const resizeHandle = windowEl.querySelector('.window-resize-handle');
  let isResizing = false;
  let startX, startY, initialWidth, initialHeight;

  resizeHandle.addEventListener('mousedown', (e) => {
    e.stopPropagation();
    isResizing = true;
    startX = e.clientX;
    startY = e.clientY;
    initialWidth = windowEl.offsetWidth;
    initialHeight = windowEl.offsetHeight;
    focusWindow(windowEl);
    document.body.style.userSelect = 'none';
  });

  document.addEventListener('mousemove', (e) => {
    if (!isResizing) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    const newWidth = Math.max(parseInt(windowEl.style.minWidth), initialWidth + dx);
    const newHeight = Math.max(parseInt(windowEl.style.minHeight), initialHeight + dy);
    windowEl.style.width = `${newWidth}px`;
    windowEl.style.height = `${newHeight}px`;
  });

  document.addEventListener('mouseup', () => {
    if (isResizing) {
      isResizing = false;
      document.body.style.userSelect = '';
    }
  });
}

function initWindowControls(windowEl, options) {
  const closeBtn = windowEl.querySelector('.window-control.close');
  const minimizeBtn = windowEl.querySelector('.window-control.minimize');
  const maximizeBtn = windowEl.querySelector('.window-control.maximize');
  let isMaximized = false;
  let preMaximizeState = null;

  closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    closeWindow(windowEl);
  });

  minimizeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    minimizeWindow(windowEl);
  });

  maximizeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (isMaximized) {
      restoreWindow(windowEl, preMaximizeState);
      isMaximized = false;
    } else {
      preMaximizeState = {
        left: windowEl.style.left,
        top: windowEl.style.top,
        width: windowEl.style.width,
        height: windowEl.style.height
      };
      maximizeWindow(windowEl);
      isMaximized = true;
    }
  });

  // Click anywhere on window to focus
  windowEl.addEventListener('mousedown', () => {
    focusWindow(windowEl);
  });
}

export function focusWindow(windowEl) {
  windowZIndex++;
  windowEl.style.zIndex = windowZIndex;
  
  if (activeWindow) {
    activeWindow.classList.remove('active');
  }
  windowEl.classList.add('active');
  activeWindow = windowEl;
}

export function closeWindow(windowEl) {
  windowEl.style.animation = 'windowClose 0.2s ease-in';
  setTimeout(() => {
    windowEl.remove();
    if (activeWindow === windowEl) {
      activeWindow = null;
    }
  }, 200);
}

export function minimizeWindow(windowEl) {
  windowEl.style.animation = 'windowMinimize 0.3s ease-in';
  setTimeout(() => {
    windowEl.style.display = 'none';
    windowEl.style.animation = '';
  }, 300);
}

export function maximizeWindow(windowEl) {
  windowEl.style.left = '0';
  windowEl.style.top = '0';
  windowEl.style.width = '100%';
  windowEl.style.height = '100%';
}

export function restoreWindow(windowEl, state) {
  windowEl.style.left = state.left;
  windowEl.style.top = state.top;
  windowEl.style.width = state.width;
  windowEl.style.height = state.height;
}
