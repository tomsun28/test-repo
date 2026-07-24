// Settings App
// System settings with multiple categories

import './settings.css';

/**
 * Create Settings app content element.
 * @returns {HTMLElement}
 */
export function createSettings() {
  const root = document.createElement('div');
  root.className = 'settings';

  // Sidebar
  const sidebar = document.createElement('div');
  sidebar.className = 'settings-sidebar';

  const sections = [
    { id: 'general', icon: '⚙️', label: 'General' },
    { id: 'appearance', icon: '🎨', label: 'Appearance' },
    { id: 'desktop', icon: '🖥️', label: 'Desktop & Dock' },
    { id: 'display', icon: '💡', label: 'Displays' },
    { id: 'sound', icon: '🔊', label: 'Sound' },
    { id: 'network', icon: '📶', label: 'Network' },
    { id: 'about', icon: 'ℹ️', label: 'About' },
  ];

  const sidebarItems = new Map();

  sections.forEach((section, index) => {
    const item = document.createElement('div');
    item.className = 'settings-sidebar-item';
    item.dataset.section = section.id;

    const icon = document.createElement('span');
    icon.className = 'settings-sidebar-icon';
    icon.textContent = section.icon;
    item.appendChild(icon);

    const label = document.createElement('span');
    label.textContent = section.label;
    item.appendChild(label);

    item.addEventListener('click', () => {
      sidebarItems.forEach(si => si.classList.remove('active'));
      item.classList.add('active');
      showSection(section.id);
    });

    if (index === 0) item.classList.add('active');
    sidebar.appendChild(item);
    sidebarItems.set(section.id, item);
  });

  root.appendChild(sidebar);

  // Content area
  const content = document.createElement('div');
  content.className = 'settings-content';

  // General section
  const generalSection = createSection('general', 'General', [
    {
      group: 'Startup',
      rows: [
        { label: 'Open apps at login', type: 'toggle', active: false },
        { label: 'Close windows when quitting an app', type: 'toggle', active: true },
      ]
    },
    {
      group: 'Language & Region',
      rows: [
        { label: 'Language', type: 'select', options: ['English', '中文', '日本語', 'Español'], value: 'English' },
        { label: 'Region', type: 'select', options: ['United States', 'China', 'Japan', 'United Kingdom'], value: 'United States' },
      ]
    }
  ]);
  content.appendChild(generalSection);

  // Appearance section
  const appearanceSection = createSection('appearance', 'Appearance', [
    {
      group: 'Theme',
      rows: [
        { label: 'Appearance', type: 'select', options: ['Light', 'Dark', 'Auto'], value: 'Light' },
        { label: 'Accent color', type: 'select', options: ['Blue', 'Purple', 'Pink', 'Red', 'Orange', 'Yellow', 'Green'], value: 'Blue' },
      ]
    }
  ]);
  content.appendChild(appearanceSection);

  // Desktop & Dock section
  const desktopSection = createSection('desktop', 'Desktop & Dock', [
    {
      group: 'Dock',
      rows: [
        { label: 'Size', type: 'select', options: ['Small', 'Medium', 'Large'], value: 'Medium' },
        { label: 'Magnification', type: 'toggle', active: true },
        { label: 'Automatically hide and show the Dock', type: 'toggle', active: false },
      ]
    }
  ]);
  content.appendChild(desktopSection);

  // Display section
  const displaySection = createSection('display', 'Displays', [
    {
      group: 'Resolution',
      rows: [
        { label: 'Resolution', type: 'select', options: ['Default', 'Scaled', 'More Space'], value: 'Default' },
        { label: 'Refresh rate', type: 'select', options: ['60 Hz', '120 Hz', 'ProMotion'], value: '60 Hz' },
      ]
    }
  ]);
  content.appendChild(displaySection);

  // Sound section
  const soundSection = createSection('sound', 'Sound', [
    {
      group: 'Output',
      rows: [
        { label: 'Output device', type: 'select', options: ['Internal Speakers', 'Headphones', 'External'], value: 'Internal Speakers' },
        { label: 'Play sound on startup', type: 'toggle', active: true },
      ]
    }
  ]);
  content.appendChild(soundSection);

  // Network section
  const networkSection = createSection('network', 'Network', [
    {
      group: 'Wi-Fi',
      rows: [
        { label: 'Wi-Fi', type: 'toggle', active: true },
        { label: 'Network', type: 'select', options: ['Home WiFi', 'Guest', 'Office'], value: 'Home WiFi' },
      ]
    }
  ]);
  content.appendChild(networkSection);

  // About section
  const aboutSection = document.createElement('div');
  aboutSection.className = 'settings-section';
  aboutSection.dataset.section = 'about';

  const aboutTitle = document.createElement('h1');
  aboutTitle.className = 'settings-title';
  aboutTitle.textContent = 'About';
  aboutSection.appendChild(aboutTitle);

  const aboutInfo = document.createElement('div');
  aboutInfo.style.cssText = 'font-size:14px;line-height:1.8;color:#1d1d1f;';
  aboutInfo.textContent = 'Web macOS Desktop\nVersion 1.0.0\n\nBuilt with HTML, CSS, and JavaScript\n© 2024';
  aboutSection.appendChild(aboutInfo);

  content.appendChild(aboutSection);

  root.appendChild(content);

  function showSection(sectionId) {
    content.querySelectorAll('.settings-section').forEach(s => s.classList.remove('active'));
    const section = content.querySelector(`[data-section="${sectionId}"]`);
    if (section) section.classList.add('active');
  }

  // Show first section by default
  showSection('general');

  return root;
}

function createSection(id, title, groups) {
  const section = document.createElement('div');
  section.className = 'settings-section';
  section.dataset.section = id;

  const titleEl = document.createElement('h1');
  titleEl.className = 'settings-title';
  titleEl.textContent = title;
  section.appendChild(titleEl);

  groups.forEach(group => {
    const groupEl = document.createElement('div');
    groupEl.className = 'settings-group';

    const groupTitle = document.createElement('div');
    groupTitle.className = 'settings-group-title';
    groupTitle.textContent = group.group;
    groupEl.appendChild(groupTitle);

    group.rows.forEach(row => {
      const rowEl = document.createElement('div');
      rowEl.className = 'settings-row';

      const labelEl = document.createElement('div');
      labelEl.className = 'settings-label';
      labelEl.textContent = row.label;
      rowEl.appendChild(labelEl);

      if (row.type === 'toggle') {
        const toggle = document.createElement('div');
        toggle.className = 'settings-toggle';
        if (row.active) toggle.classList.add('active');

        const knob = document.createElement('div');
        knob.className = 'settings-toggle-knob';
        toggle.appendChild(knob);

        toggle.addEventListener('click', () => {
          toggle.classList.toggle('active');
        });

        rowEl.appendChild(toggle);
      } else if (row.type === 'select') {
        const select = document.createElement('select');
        select.className = 'settings-select';
        row.options.forEach(opt => {
          const option = document.createElement('option');
          option.value = opt;
          option.textContent = opt;
          if (opt === row.value) option.selected = true;
          select.appendChild(option);
        });
        rowEl.appendChild(select);
      }

      groupEl.appendChild(rowEl);
    });

    section.appendChild(groupEl);
  });

  return section;
}
