// Window Management System

let windowZIndex = 1000;
let activeWindow = null;

export class Window {
  constructor(options) {
    this.id = options.id || `window-${Date.now()}`;
    this.title = options.title || 'Untitled';
    this.content = options.content || '';
    this.width = options.width || 600;
    this.height = options.height || 400;
    this.x = options.x || Math.random() * (window.innerWidth - this.width);
    this.y = options.y || Math.random() * (window.innerHeight - this.height - 100);
    this.minWidth = options.minWidth || 300;
    this.minHeight = options.minHeight || 200;
    this.isMinimized = false;
    this.isMaximized = false;
    this.preMaximizeState = null;
    this.element = null;

    this.createWindow();
  }

  createWindow() {
    const win = document.createElement('div');
    win.className = 'window';
    win.id = this.id;
    win.style.left = `${this.x}px`;
    win.style.top = `${this.y}px`;
    win.style.width = `${this.width}px`;
    win.style.height = `${this.height}px`;
    win.style.zIndex = windowZIndex++;

    win.innerHTML = `
      <div class="window-header">
        <div class="window-controls">
          <div class="window-control close" title="Close"></div>
          <div class="window-control minimize" title="Minimize"></div>
          <div class="window-control maximize" title="Maximize"></div>
        </div>
        <div class="window-title">${this.title}</div>
      </div>
      <div class="window-content">${this.content}</div>
      <div class="window-resize-handle n"></div>
      <div class="window-resize-handle s"></div>
      <div class="window-resize-handle e"></div>
      <div class="window-resize-handle w"></div>
      <div class="window-resize-handle ne"></div>
      <div class="window-resize-handle nw"></div>
      <div class="window-resize-handle se"></div>
      <div class="window-resize-handle sw"></div>
    `;

    this.element = win;
    this.attachEventListeners();
    document.getElementById('desktop').appendChild(win);
    this.focus();

    return win;
  }

  attachEventListeners() {
    // Focus on click
    this.element.addEventListener('mousedown', () => {
      this.focus();
    });

    // Close button
    const closeBtn = this.element.querySelector('.window-control.close');
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.close();
    });

    // Minimize button
    const minimizeBtn = this.element.querySelector('.window-control.minimize');
    minimizeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.minimize();
    });

    // Maximize button
    const maximizeBtn = this.element.querySelector('.window-control.maximize');
    maximizeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleMaximize();
    });

    // Double-click title bar to maximize
    const header = this.element.querySelector('.window-header');
    header.addEventListener('dblclick', (e) => {
      if (e.target.closest('.window-control')) return;
      this.toggleMaximize();
    });

    // Dragging
    this.initDrag(header);

    // Resizing
    this.initResize();
  }

  focus() {
    if (this.isMinimized) {
      this.restore();
    }

    // Remove active state from all windows
    document.querySelectorAll('.window').forEach(w => {
      w.classList.remove('active');
    });

    // Bring to front
    this.element.style.zIndex = windowZIndex++;
    this.element.classList.add('active');
    activeWindow = this;
  }

  close() {
    this.element.style.transition = 'opacity 0.2s, transform 0.2s';
    this.element.style.opacity = '0';
    this.element.style.transform = 'scale(0.9)';

    setTimeout(() => {
      this.element.remove();
    }, 200);
  }

  minimize() {
    this.isMinimized = true;
    this.element.classList.add('minimized');
  }

  restore() {
    this.isMinimized = false;
    this.element.classList.remove('minimized');
  }

  toggleMaximize() {
    if (this.isMaximized) {
      // Restore previous state
      this.element.classList.remove('maximized');
      this.element.style.left = `${this.preMaximizeState.x}px`;
      this.element.style.top = `${this.preMaximizeState.y}px`;
      this.element.style.width = `${this.preMaximizeState.width}px`;
      this.element.style.height = `${this.preMaximizeState.height}px`;
      this.isMaximized = false;
    } else {
      // Save current state
      this.preMaximizeState = {
        x: parseInt(this.element.style.left),
        y: parseInt(this.element.style.top),
        width: parseInt(this.element.style.width),
        height: parseInt(this.element.style.height)
      };

      // Maximize
      this.element.classList.add('maximized');
      this.element.style.left = '0';
      this.element.style.top = '0';
      this.element.style.width = '100vw';
      this.element.style.height = '100vh';
      this.isMaximized = true;
    }
  }

  initDrag(header) {
    let isDragging = false;
    let startX, startY, startLeft, startTop;

    header.addEventListener('mousedown', (e) => {
      if (e.target.closest('.window-control')) return;
      if (this.isMaximized) return;

      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      startLeft = parseInt(this.element.style.left);
      startTop = parseInt(this.element.style.top);

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    });

    const onMouseMove = (e) => {
      if (!isDragging) return;

      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;

      let newLeft = startLeft + deltaX;
      let newTop = startTop + deltaY;

      // Keep window within viewport
      newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - this.minWidth));
      newTop = Math.max(0, Math.min(newTop, window.innerHeight - 50));

      this.element.style.left = `${newLeft}px`;
      this.element.style.top = `${newTop}px`;
    };

    const onMouseUp = () => {
      isDragging = false;
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }

  initResize() {
    const handles = this.element.querySelectorAll('.window-resize-handle');

    handles.forEach(handle => {
      let isResizing = false;
      let startX, startY, startWidth, startHeight, startLeft, startTop;
      const direction = handle.className.replace('window-resize-handle ', '');

      handle.addEventListener('mousedown', (e) => {
        if (this.isMaximized) return;

        e.stopPropagation();
        isResizing = true;
        startX = e.clientX;
        startY = e.clientY;
        startWidth = parseInt(this.element.style.width);
        startHeight = parseInt(this.element.style.height);
        startLeft = parseInt(this.element.style.left);
        startTop = parseInt(this.element.style.top);

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
      });

      const onMouseMove = (e) => {
        if (!isResizing) return;

        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;

        let newWidth = startWidth;
        let newHeight = startHeight;
        let newLeft = startLeft;
        let newTop = startTop;

        // Handle different resize directions
        if (direction.includes('e')) {
          newWidth = Math.max(this.minWidth, startWidth + deltaX);
        }
        if (direction.includes('w')) {
          const widthChange = Math.min(deltaX, startWidth - this.minWidth);
          newWidth = Math.max(this.minWidth, startWidth - widthChange);
          newLeft = startLeft + widthChange;
        }
        if (direction.includes('s')) {
          newHeight = Math.max(this.minHeight, startHeight + deltaY);
        }
        if (direction.includes('n')) {
          const heightChange = Math.min(deltaY, startHeight - this.minHeight);
          newHeight = Math.max(this.minHeight, startHeight - heightChange);
          newTop = startTop + heightChange;
        }

        // Keep window within viewport
        if (newLeft < 0) {
          newWidth += newLeft;
          newLeft = 0;
        }
        if (newTop < 0) {
          newHeight += newTop;
          newTop = 0;
        }
        if (newLeft + newWidth > window.innerWidth) {
          newWidth = window.innerWidth - newLeft;
        }
        if (newTop + newHeight > window.innerHeight) {
          newHeight = window.innerHeight - newTop;
        }

        this.element.style.width = `${newWidth}px`;
        this.element.style.height = `${newHeight}px`;
        this.element.style.left = `${newLeft}px`;
        this.element.style.top = `${newTop}px`;
      };

      const onMouseUp = () => {
        isResizing = false;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };
    });
  }
}

export function createWindow(options) {
  return new Window(options);
}
