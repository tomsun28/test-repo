// Window Management System
// Provides draggable, resizable windows with minimize/maximize/close and z-index management

import './window-manager.css';

let windowIdCounter = 0;
let zIndexCounter = 100;

const windows = new Map();
let focusedWindowId = null;

// Default window options
const DEFAULTS = {
  title: 'Untitled',
  x: 100,
  y: 80,
  width: 600,
  height: 400,
  minWidth: 300,
  minHeight: 200,
  content: '',
  onClose: null,
};

// Check if mobile viewport
function isMobile() {
  return window.innerWidth <= 768;
}

/**
 * Create and open a new window.
 * @param {Object} options
 * @returns {Object} window handle with { id, element, close, focus, minimize, maximize, restore }
 */
export function createWindow(options = {}) {
  const opts = { ...DEFAULTS, ...options };
  const id = `window-${++windowIdCounter}`;

  // On mobile, use full screen dimensions
  if (isMobile()) {
    opts.x = 0;
    opts.y = 0;
    opts.width = window.innerWidth;
    opts.height = window.innerHeight - 22; // Account for menu bar
  } else {
    // Stagger new windows on desktop
    const offset = (windowIdCounter % 8) * 30;
    opts.x += offset;
    opts.y += offset;
  }

  const win = {
    id,
    title: opts.title,
    x: opts.x,
    y: opts.y,
    width: opts.width,
    height: opts.height,
    minWidth: opts.minWidth,
    minHeight: opts.minHeight,
    state: 'normal', // normal | minimized | maximized
    prevState: null, // saved state before maximize
    element: null,
    onClose: opts.onClose,
  };

  win.element = buildWindowDOM(win, opts.content);
  document.getElementById('desktop').appendChild(win.element);

  windows.set(id, win);
  focusWindow(id);

  return getWindowHandle(win);
}

/**
 * Focus a window (bring to front).
 */
export function focusWindow(id) {
  const win = windows.get(id);
  if (!win) return;

  if (win.state === 'minimized') {
    restoreWindow(id);
    return;
  }

  // Remove focused class from previous
  if (focusedWindowId && focusedWindowId !== id) {
    const prev = windows.get(focusedWindowId);
    if (prev && prev.element) {
      prev.element.classList.remove('focused');
    }
  }

  zIndexCounter++;
  win.element.style.zIndex = zIndexCounter;
  win.element.classList.add('focused');
  focusedWindowId = id;
}

/**
 * Minimize a window.
 * Window remains visible (scaled down) and can be clicked to restore.
 * A proper dock/taskbar integration should eventually handle minimized windows.
 */
export function minimizeWindow(id) {
  const win = windows.get(id);
  if (!win || win.state === 'minimized') return;

  win.state = 'minimized';
  win.element.classList.add('minimized', 'restorable');
  win.element.classList.remove('focused');

  if (focusedWindowId === id) {
    focusedWindowId = null;
    // Focus next top window
    focusTopWindow();
  }
}

/**
 * Maximize a window (fill available desktop area).
 */
export function maximizeWindow(id) {
  const win = windows.get(id);
  if (!win) return;

  if (win.state === 'maximized') {
    restoreWindow(id);
    return;
  }

  // Save current geometry
  win.prevState = {
    x: win.x,
    y: win.y,
    width: win.width,
    height: win.height,
    state: win.state,
  };

  win.state = 'maximized';
  win.element.classList.add('maximized');
  win.element.classList.remove('resizable');

  // Position at top-left of desktop, leaving room for future dock/menu bar
  const desktop = document.getElementById('desktop');
  const rect = desktop.getBoundingClientRect();
  applyGeometry(win, 0, 0, rect.width, rect.height - 70); // 70px reserved for dock
}

/**
 * Restore a window from minimized or maximized state.
 */
export function restoreWindow(id) {
  const win = windows.get(id);
  if (!win) return;

  if (win.state === 'minimized') {
    win.state = 'normal';
    win.element.classList.remove('minimized', 'restorable');
    focusWindow(id);
    return;
  }

  if (win.state === 'maximized' && win.prevState) {
    win.element.classList.remove('maximized');
    win.element.classList.add('resizable');
    applyGeometry(win, win.prevState.x, win.prevState.y, win.prevState.width, win.prevState.height);
    win.state = win.prevState.state || 'normal';
    win.prevState = null;
    focusWindow(id);
  }
}

/**
 * Close and remove a window.
 */
export function closeWindow(id) {
  const win = windows.get(id);
  if (!win) return;

  if (typeof win.onClose === 'function') {
    win.onClose();
  }

  // Remove document-level event listeners to prevent memory leaks
  if (win._listeners) {
    win._listeners.forEach(({ target, type, handler }) => {
      target.removeEventListener(type, handler);
    });
    win._listeners = null;
  }

  win.element.remove();
  windows.delete(id);

  if (focusedWindowId === id) {
    focusedWindowId = null;
    focusTopWindow();
  }
}

/**
 * Focus the topmost visible window.
 */
function focusTopWindow() {
  let topWin = null;
  let topZ = -1;
  windows.forEach((w) => {
    if (w.state !== 'minimized') {
      const z = parseInt(w.element.style.zIndex || '0', 10);
      if (z > topZ) {
        topZ = z;
        topWin = w;
      }
    }
  });
  if (topWin) {
    focusWindow(topWin.id);
  }
}

/**
 * Get a public handle for a window.
 */
function getWindowHandle(win) {
  return {
    id: win.id,
    element: win.element,
    close: () => closeWindow(win.id),
    focus: () => focusWindow(win.id),
    minimize: () => minimizeWindow(win.id),
    maximize: () => maximizeWindow(win.id),
    restore: () => restoreWindow(win.id),
  };
}

// ---- DOM Construction ----

function buildWindowDOM(win, content) {
  const el = document.createElement('div');
  el.className = 'window resizable';
  el.dataset.windowId = win.id;
  applyGeometry(win, win.x, win.y, win.width, win.height);

  // Title bar
  const titlebar = document.createElement('div');
  titlebar.className = 'window-titlebar';

  // Traffic light buttons
  const btnClose = createTrafficLight('close', '#ff5f57', () => closeWindow(win.id));
  const btnMinimize = createTrafficLight('minimize', '#febc2e', () => minimizeWindow(win.id));
  const btnMaximize = createTrafficLight('maximize', '#28c840', () => maximizeWindow(win.id));

  const trafficLights = document.createElement('div');
  trafficLights.className = 'traffic-lights';
  trafficLights.appendChild(btnClose);
  trafficLights.appendChild(btnMinimize);
  trafficLights.appendChild(btnMaximize);

  const titleText = document.createElement('div');
  titleText.className = 'window-title';
  titleText.textContent = win.title;

  titlebar.appendChild(trafficLights);
  titlebar.appendChild(titleText);

  // Content area
  const contentEl = document.createElement('div');
  contentEl.className = 'window-content';
  if (typeof content === 'string') {
    contentEl.innerHTML = content;
  } else if (content instanceof HTMLElement) {
    contentEl.appendChild(content);
  }

  el.appendChild(titlebar);
  el.appendChild(contentEl);

  // Resize handles
  const handles = ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'];
  handles.forEach((dir) => {
    const handle = document.createElement('div');
    handle.className = `resize-handle resize-${dir}`;
    handle.dataset.direction = dir;
    el.appendChild(handle);
  });

  // Event: focus on click
  el.addEventListener('mousedown', (e) => {
    if (!e.target.closest('.resize-handle')) {
      focusWindow(win.id);
    }
  });

  // Drag behavior on titlebar
  setupDrag(win, titlebar);

  // Resize behavior on handles
  handles.forEach((dir) => {
    const handle = el.querySelector(`.resize-${dir}`);
    setupResize(win, handle, dir);
  });

  // Double-click titlebar to maximize
  titlebar.addEventListener('dblclick', (e) => {
    if (!e.target.closest('.traffic-lights')) {
      maximizeWindow(win.id);
    }
  });

  return el;
}

function createTrafficLight(action, color, onClick) {
  const btn = document.createElement('button');
  btn.className = `traffic-light traffic-light-${action}`;
  btn.style.setProperty('--light-color', color);
  btn.title = action.charAt(0).toUpperCase() + action.slice(1);
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    onClick();
  });
  return btn;
}

function applyGeometry(win, x, y, width, height) {
  win.x = x;
  win.y = y;
  win.width = width;
  win.height = height;
  const el = win.element;
  if (!el) return;
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;
  el.style.width = `${width}px`;
  el.style.height = `${height}px`;
}

// ---- Drag Behavior ----

function setupDrag(win, titlebar) {
  let dragging = false;
  let startX, startY, origX, origY;

  const startDrag = (clientX, clientY) => {
    dragging = true;
    startX = clientX;
    startY = clientY;
    origX = win.x;
    origY = win.y;
  };

  const doDrag = (clientX, clientY) => {
    if (!dragging) return;
    const dx = clientX - startX;
    const dy = clientY - startY;
    const newX = origX + dx;
    const newY = Math.max(0, origY + dy); // don't go above screen top
    applyGeometry(win, newX, newY, win.width, win.height);
  };

  const endDrag = () => {
    dragging = false;
  };

  // Mouse events
  titlebar.addEventListener('mousedown', (e) => {
    // Don't drag if clicking traffic lights or if maximized
    if (e.target.closest('.traffic-lights')) return;
    if (win.state === 'maximized') return;
    startDrag(e.clientX, e.clientY);
    e.preventDefault();
  });

  const onMouseMove = (e) => doDrag(e.clientX, e.clientY);
  const onMouseUp = () => endDrag();

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);

  // Touch events
  titlebar.addEventListener('touchstart', (e) => {
    if (e.target.closest('.traffic-lights')) return;
    if (win.state === 'maximized') return;
    const touch = e.touches[0];
    startDrag(touch.clientX, touch.clientY);
  }, { passive: true });

  const onTouchMove = (e) => {
    if (!dragging) return;
    e.preventDefault();
    const touch = e.touches[0];
    doDrag(touch.clientX, touch.clientY);
  };

  const onTouchEnd = () => endDrag();

  document.addEventListener('touchmove', onTouchMove, { passive: false });
  document.addEventListener('touchend', onTouchEnd);

  // Store references for cleanup
  if (!win._listeners) win._listeners = [];
  win._listeners.push(
    { target: document, type: 'mousemove', handler: onMouseMove },
    { target: document, type: 'mouseup', handler: onMouseUp },
    { target: document, type: 'touchmove', handler: onTouchMove },
    { target: document, type: 'touchend', handler: onTouchEnd },
  );
}

// ---- Resize Behavior ----

function setupResize(win, handle, direction) {
  let resizing = false;
  let startX, startY, origX, origY, origW, origH;

  const startResize = (clientX, clientY) => {
    if (win.state === 'maximized') return;
    resizing = true;
    startX = clientX;
    startY = clientY;
    origX = win.x;
    origY = win.y;
    origW = win.width;
    origH = win.height;
  };

  const doResize = (clientX, clientY) => {
    if (!resizing) return;
    const dx = clientX - startX;
    const dy = clientY - startY;

    let newX = origX;
    let newY = origY;
    let newW = origW;
    let newH = origH;

    // Horizontal
    if (direction.includes('e')) {
      newW = Math.max(win.minWidth, origW + dx);
    }
    if (direction.includes('w')) {
      const proposedW = origW - dx;
      if (proposedW >= win.minWidth) {
        newW = proposedW;
        newX = origX + dx;
      } else {
        newW = win.minWidth;
        newX = origX + origW - win.minWidth;
      }
    }

    // Vertical
    if (direction.includes('s')) {
      newH = Math.max(win.minHeight, origH + dy);
    }
    if (direction.includes('n')) {
      const proposedH = origH - dy;
      if (proposedH >= win.minHeight) {
        newH = proposedH;
        newY = origY + dy;
      } else {
        newH = win.minHeight;
        newY = origY + origH - win.minHeight;
      }
    }

    applyGeometry(win, newX, newY, newW, newH);
  };

  const endResize = () => {
    resizing = false;
  };

  // Mouse events
  handle.addEventListener('mousedown', (e) => {
    startResize(e.clientX, e.clientY);
    e.preventDefault();
    e.stopPropagation();
  });

  const onMouseMove = (e) => doResize(e.clientX, e.clientY);
  const onMouseUp = () => endResize();

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);

  // Touch events
  handle.addEventListener('touchstart', (e) => {
    const touch = e.touches[0];
    startResize(touch.clientX, touch.clientY);
    e.preventDefault();
    e.stopPropagation();
  }, { passive: false });

  const onTouchMove = (e) => {
    if (!resizing) return;
    e.preventDefault();
    const touch = e.touches[0];
    doResize(touch.clientX, touch.clientY);
  };

  const onTouchEnd = () => endResize();

  document.addEventListener('touchmove', onTouchMove, { passive: false });
  document.addEventListener('touchend', onTouchEnd);

  // Store references for cleanup
  if (!win._listeners) win._listeners = [];
  win._listeners.push(
    { target: document, type: 'mousemove', handler: onMouseMove },
    { target: document, type: 'mouseup', handler: onMouseUp },
    { target: document, type: 'touchmove', handler: onTouchMove },
    { target: document, type: 'touchend', handler: onTouchEnd },
  );
}
