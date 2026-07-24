// Settings Application

import './settings.css';

export function createSettings() {
  const container = document.createElement('div');
  container.className = 'settings';

  // Sidebar
  const sidebar = document.createElement('div');
  sidebar.className = 'settings-sidebar';

  const sections = [
    { id: 'general', label: 'General', icon: '⚙️' },
    { id: 'appearance', label: 'Appearance', icon: '🎨' },
    { id: 'desktop', label: 'Desktop & Dock', icon: '🖥️' },
    { id: 'display', label: 'Displays', icon: '🖥️' },
    { id: 'sound', label: 'Sound', icon: '🔊' },
    { id: 'network', label: 'Network', icon: '📶' },
    { id: 'about', label: 'About', icon: 'ℹ️' }
  ];

  let activeSection = 'general';

  sections.forEach(section => {
    const item = document.createElement('div');
    item.className = 'settings-item';
    item.dataset.section = section.id;
    if (section.id === activeSection) {
      item.classList.add('active');
    }

    const icon = document.createElement('span');
    icon.className = 'settings-icon';
    icon.textContent = section.icon;

    const label = document.createElement('span');
    label.className = 'settings-label';
    label.textContent = section.label;

    item.appendChild(icon);
    item.appendChild(label);

    item.addEventListener('click', () => {
      document.querySelectorAll('.settings-item').forEach(i => {
        i.classList.remove('active');
      });
      item.classList.add('active');
      activeSection = section.id;
      renderContent();
    });

    sidebar.appendChild(item);
  });

  container.appendChild(sidebar);

  // Content area
  const content = document.createElement('div');
  content.className = 'settings-content';
  container.appendChild(content);

  function renderContent() {
    content.innerHTML = '';

    const title = document.createElement('h2');
    title.className = 'settings-title';
    const currentSection = sections.find(s => s.id === activeSection);
    title.textContent = currentSection.label;
    content.appendChild(title);

    if (activeSection === 'general') {
      renderGeneralSettings();
    } else if (activeSection === 'appearance') {
      renderAppearanceSettings();
    } else if (activeSection === 'about') {
      renderAboutSettings();
    } else {
      const placeholder = document.createElement('p');
      placeholder.className = 'settings-placeholder';
      placeholder.textContent = `${currentSection.label} settings coming soon...`;
      content.appendChild(placeholder);
    }
  }

  function renderGeneralSettings() {
    const group = createSettingGroup('System Preferences');

    group.appendChild(createCheckbox('Show desktop icons', true));
    group.appendChild(createCheckbox('Enable animations', true));
    group.appendChild(createCheckbox('Play sound effects', false));
    group.appendChild(createSelect('Language', ['English', '中文', '日本語', '한국어'], 'English'));
    group.appendChild(createSelect('Region', ['United States', 'China', 'Japan', 'Korea'], 'United States'));

    content.appendChild(group);
  }

  function renderAppearanceSettings() {
    const group = createSettingGroup('Theme');

    group.appendChild(createRadio('Light', 'theme', false));
    group.appendChild(createRadio('Dark', 'theme', true));
    group.appendChild(createRadio('Auto', 'theme', false));

    content.appendChild(group);

    const colorGroup = createSettingGroup('Accent Color');
    const colors = ['#007aff', '#5856d6', '#ff2d55', '#ff9500', '#34c759', '#8e8e93'];

    const colorPicker = document.createElement('div');
    colorPicker.className = 'color-picker';

    colors.forEach(color => {
      const swatch = document.createElement('div');
      swatch.className = 'color-swatch';
      swatch.style.backgroundColor = color;
      if (color === '#007aff') {
        swatch.classList.add('selected');
      }
      swatch.addEventListener('click', () => {
        document.querySelectorAll('.color-swatch').forEach(s => {
          s.classList.remove('selected');
        });
        swatch.classList.add('selected');
      });
      colorPicker.appendChild(swatch);
    });

    colorGroup.appendChild(colorPicker);
    content.appendChild(colorGroup);
  }

  function renderAboutSettings() {
    const about = document.createElement('div');
    about.className = 'about-section';

    const logo = document.createElement('div');
    logo.className = 'about-logo';
    logo.textContent = '🍎';

    const info = document.createElement('div');
    info.className = 'about-info';

    const name = document.createElement('h3');
    name.textContent = 'Web macOS Desktop';
    info.appendChild(name);

    const version = document.createElement('p');
    version.textContent = 'Version 1.0.0';
    info.appendChild(version);

    const desc = document.createElement('p');
    desc.className = 'about-description';
    desc.textContent = 'A web-based macOS desktop environment built with modern web technologies.';
    info.appendChild(desc);

    const specs = document.createElement('div');
    specs.className = 'about-specs';
    specs.innerHTML = `
      <div class="spec-row"><span class="spec-label">Platform:</span><span>Web Browser</span></div>
      <div class="spec-row"><span class="spec-label">Framework:</span><span>Vanilla JavaScript</span></div>
      <div class="spec-row"><span class="spec-label">Build Tool:</span><span>Vite</span></div>
    `;
    info.appendChild(specs);

    about.appendChild(logo);
    about.appendChild(info);
    content.appendChild(about);
  }

  function createSettingGroup(title) {
    const group = document.createElement('div');
    group.className = 'setting-group';

    const groupTitle = document.createElement('h3');
    groupTitle.className = 'setting-group-title';
    groupTitle.textContent = title;
    group.appendChild(groupTitle);

    return group;
  }

  function createCheckbox(label, checked) {
    const row = document.createElement('div');
    row.className = 'setting-row';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = checked;
    checkbox.className = 'setting-checkbox';

    const labelEl = document.createElement('label');
    labelEl.className = 'setting-label';
    labelEl.textContent = label;

    checkbox.addEventListener('change', () => {
      console.log(`Setting "${label}" changed to ${checkbox.checked}`);
    });

    row.appendChild(checkbox);
    row.appendChild(labelEl);

    return row;
  }

  function createRadio(label, name, checked) {
    const row = document.createElement('div');
    row.className = 'setting-row';

    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.name = name;
    radio.checked = checked;
    radio.className = 'setting-radio';

    const labelEl = document.createElement('label');
    labelEl.className = 'setting-label';
    labelEl.textContent = label;

    radio.addEventListener('change', () => {
      if (radio.checked) {
        console.log(`Radio "${name}" set to "${label}"`);
      }
    });

    row.appendChild(radio);
    row.appendChild(labelEl);

    return row;
  }

  function createSelect(label, options, selected) {
    const row = document.createElement('div');
    row.className = 'setting-row';

    const labelEl = document.createElement('label');
    labelEl.className = 'setting-label';
    labelEl.textContent = label;

    const select = document.createElement('select');
    select.className = 'setting-select';

    options.forEach(opt => {
      const option = document.createElement('option');
      option.value = opt;
      option.textContent = opt;
      if (opt === selected) {
        option.selected = true;
      }
      select.appendChild(option);
    });

    select.addEventListener('change', () => {
      console.log(`Select "${label}" changed to ${select.value}`);
    });

    row.appendChild(labelEl);
    row.appendChild(select);

    return row;
  }

  renderContent();

  return container;
}
