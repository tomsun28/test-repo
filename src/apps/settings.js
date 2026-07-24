// Settings App
// System preferences with appearance and display settings

export function createSettingsApp() {
  const container = document.createElement('div');
  container.className = 'settings-app';
  container.style.cssText = `
    display: flex;
    height: 100%;
    background: #f5f5f5;
  `;

  // Sidebar
  const sidebar = document.createElement('div');
  sidebar.style.cssText = `
    width: 200px;
    background: #e8e8e8;
    border-right: 1px solid #d0d0d0;
    padding: 16px 0;
  `;

  const sections = [
    { id: 'general', label: 'General', icon: '⚙️' },
    { id: 'appearance', label: 'Appearance', icon: '🎨' },
    { id: 'display', label: 'Display', icon: '🖥️' },
    { id: 'sound', label: 'Sound', icon: '🔊' },
  ];

  let activeSection = 'general';

  sections.forEach(({ id, label, icon }) => {
    const item = document.createElement('div');
    item.dataset.section = id;
    item.style.cssText = `
      padding: 10px 16px;
      cursor: pointer;
      transition: background 0.15s;
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
    `;
    item.innerHTML = `<span>${icon}</span><span>${label}</span>`;

    item.addEventListener('click', () => {
      activeSection = id;
      updateSidebar();
      updateContent();
    });

    item.addEventListener('mouseenter', () => {
      if (activeSection !== id) {
        item.style.background = '#d8d8d8';
      }
    });
    item.addEventListener('mouseleave', () => {
      if (activeSection !== id) {
        item.style.background = 'transparent';
      }
    });

    sidebar.appendChild(item);
  });

  function updateSidebar() {
    sidebar.querySelectorAll('[data-section]').forEach(item => {
      if (item.dataset.section === activeSection) {
        item.style.background = '#007aff';
        item.style.color = 'white';
      } else {
        item.style.background = 'transparent';
        item.style.color = 'black';
      }
    });
  }

  // Content area
  const content = document.createElement('div');
  content.style.cssText = `
    flex: 1;
    padding: 24px;
    overflow-y: auto;
  `;

  function updateContent() {
    content.innerHTML = '';

    if (activeSection === 'general') {
      content.innerHTML = `
        <h2 style="margin-bottom: 20px; font-size: 24px;">General</h2>
        <div style="background: white; padding: 16px; border-radius: 8px; margin-bottom: 16px;">
          <h3 style="margin-bottom: 12px; font-size: 16px;">Startup</h3>
          <label style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
            <input type="checkbox" checked>
            <span>Open apps on startup</span>
          </label>
          <label style="display: flex; align-items: center; gap: 8px;">
            <input type="checkbox">
            <span>Show welcome message</span>
          </label>
        </div>
        <div style="background: white; padding: 16px; border-radius: 8px;">
          <h3 style="margin-bottom: 12px; font-size: 16px;">Language & Region</h3>
          <div style="margin-bottom: 12px;">
            <label style="display: block; margin-bottom: 4px; font-size: 13px; color: #666;">Language</label>
            <select style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
              <option>English</option>
              <option>中文</option>
              <option>Español</option>
              <option>Français</option>
            </select>
          </div>
        </div>
      `;
    } else if (activeSection === 'appearance') {
      content.innerHTML = `
        <h2 style="margin-bottom: 20px; font-size: 24px;">Appearance</h2>
        <div style="background: white; padding: 16px; border-radius: 8px; margin-bottom: 16px;">
          <h3 style="margin-bottom: 12px; font-size: 16px;">Theme</h3>
          <div style="display: flex; gap: 12px;">
            <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
              <input type="radio" name="theme" value="light" checked>
              <span>Light</span>
            </label>
            <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
              <input type="radio" name="theme" value="dark">
              <span>Dark</span>
            </label>
            <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
              <input type="radio" name="theme" value="auto">
              <span>Auto</span>
            </label>
          </div>
        </div>
        <div style="background: white; padding: 16px; border-radius: 8px;">
          <h3 style="margin-bottom: 12px; font-size: 16px;">Accent Color</h3>
          <div style="display: flex; gap: 12px;">
            <div style="width: 32px; height: 32px; background: #007aff; border-radius: 50%; cursor: pointer; border: 3px solid #007aff;"></div>
            <div style="width: 32px; height: 32px; background: #ff3b30; border-radius: 50%; cursor: pointer; border: 3px solid transparent;"></div>
            <div style="width: 32px; height: 32px; background: #ff9500; border-radius: 50%; cursor: pointer; border: 3px solid transparent;"></div>
            <div style="width: 32px; height: 32px; background: #34c759; border-radius: 50%; cursor: pointer; border: 3px solid transparent;"></div>
            <div style="width: 32px; height: 32px; background: #af52de; border-radius: 50%; cursor: pointer; border: 3px solid transparent;"></div>
          </div>
        </div>
      `;
    } else if (activeSection === 'display') {
      content.innerHTML = `
        <h2 style="margin-bottom: 20px; font-size: 24px;">Display</h2>
        <div style="background: white; padding: 16px; border-radius: 8px; margin-bottom: 16px;">
          <h3 style="margin-bottom: 12px; font-size: 16px;">Resolution</h3>
          <select style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
            <option>Default for display</option>
            <option>1920 x 1080</option>
            <option>1680 x 1050</option>
            <option>1440 x 900</option>
          </select>
        </div>
        <div style="background: white; padding: 16px; border-radius: 8px;">
          <h3 style="margin-bottom: 12px; font-size: 16px;">Brightness</h3>
          <input type="range" min="0" max="100" value="80" style="width: 100%;">
        </div>
      `;
    } else if (activeSection === 'sound') {
      content.innerHTML = `
        <h2 style="margin-bottom: 20px; font-size: 24px;">Sound</h2>
        <div style="background: white; padding: 16px; border-radius: 8px; margin-bottom: 16px;">
          <h3 style="margin-bottom: 12px; font-size: 16px;">Output Volume</h3>
          <input type="range" min="0" max="100" value="70" style="width: 100%;">
          <label style="display: flex; align-items: center; gap: 8px; margin-top: 12px;">
            <input type="checkbox" checked>
            <span>Mute when connected to headphones</span>
          </label>
        </div>
        <div style="background: white; padding: 16px; border-radius: 8px;">
          <h3 style="margin-bottom: 12px; font-size: 16px;">Sound Effects</h3>
          <label style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
            <input type="checkbox" checked>
            <span>Play sound on startup</span>
          </label>
          <label style="display: flex; align-items: center; gap: 8px;">
            <input type="checkbox" checked>
            <span>Play sound on alert</span>
          </label>
        </div>
      `;
    }
  }

  updateSidebar();
  updateContent();

  container.appendChild(sidebar);
  container.appendChild(content);

  return container;
}
