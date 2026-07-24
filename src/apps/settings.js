// Settings App
// macOS-style system settings with multiple preference panes

import './settings.css';
import { createWindow } from '../window-manager.js';

const SETTINGS_SECTIONS = [
  { id: 'general', name: 'General', icon: '⚙️' },
  { id: 'appearance', name: 'Appearance', icon: '🎨' },
  { id: 'desktop', name: 'Desktop & Dock', icon: '🖥️' },
  { id: 'display', name: 'Displays', icon: '🖼️' },
  { id: 'sound', name: 'Sound', icon: '🔊' },
  { id: 'network', name: 'Network', icon: '📶' },
  { id: 'bluetooth', name: 'Bluetooth', icon: '📡' },
  { id: 'notifications', name: 'Notifications', icon: '🔔' },
  { id: 'about', name: 'About', icon: 'ℹ️' },
];

/**
 * Open Settings app
 */
export function openSettings() {
  const container = document.createElement('div');
  container.className = 'settings';

  // Sidebar
  const sidebar = document.createElement('div');
  sidebar.className = 'settings-sidebar';

  // Content
  const content = document.createElement('div');
  content.className = 'settings-content';

  // Build sections
  const sectionsMap = {};
  SETTINGS_SECTIONS.forEach(section => {
    // Sidebar item
    const item = document.createElement('div');
    item.className = 'settings-item';
    item.dataset.section = section.id;

    const icon = document.createElement('span');
    icon.className = 'settings-item-icon';
    icon.textContent = section.icon;

    const label = document.createElement('span');
    label.textContent = section.name;

    item.appendChild(icon);
    item.appendChild(label);

    // Content section
    const sectionDiv = document.createElement('div');
    sectionDiv.className = 'settings-section';
    sectionDiv.dataset.section = section.id;
    buildSectionContent(section, sectionDiv);

    sectionsMap[section.id] = { item, sectionDiv };

    sidebar.appendChild(item);
    content.appendChild(sectionDiv);
  });

  // Sidebar click handler
  sidebar.addEventListener('click', (e) => {
    const item = e.target.closest('.settings-item');
    if (!item) return;
    const sectionId = item.dataset.section;

    Object.values(sectionsMap).forEach(s => {
      s.item.classList.remove('active');
      s.sectionDiv.classList.remove('active');
    });

    sectionsMap[sectionId].item.classList.add('active');
    sectionsMap[sectionId].sectionDiv.classList.add('active');
  });

  container.appendChild(sidebar);
  container.appendChild(content);

  // Select first section
  sectionsMap['general'].item.classList.add('active');
  sectionsMap['general'].sectionDiv.classList.add('active');

  return createWindow({
    title: 'System Settings',
    content: container,
    width: 720,
    height: 500,
    minWidth: 600,
    minHeight: 400,
  });
}

/**
 * Build content for a settings section
 */
function buildSectionContent(section, container) {
  const title = document.createElement('div');
  title.className = 'settings-title';
  title.textContent = section.name;
  container.appendChild(title);

  switch (section.id) {
    case 'general':
      container.appendChild(buildGroup([
        { label: 'About This Mac', type: 'value', value: 'Web macOS Desktop' },
        { label: 'Software Update', type: 'value', value: 'Up to date' },
        { label: 'Storage', type: 'value', value: '45.2 GB available of 256 GB' },
      ]));
      container.appendChild(buildGroup([
        { label: 'AirDrop & Handoff', type: 'toggle', value: true },
        { label: 'Login Items', type: 'value', value: '3 items' },
      ]));
      break;

    case 'appearance':
      container.appendChild(buildGroup([
        { label: 'Appearance', type: 'value', value: 'Auto' },
        { label: 'Accent Color', type: 'value', value: 'Multicolor' },
        { label: 'Highlight Color', type: 'value', value: 'Blue' },
      ]));
      container.appendChild(buildGroup([
        { label: 'Sidebar Icon Size', type: 'value', value: 'Medium' },
        { label: 'Show Scroll Bars', type: 'value', value: 'Automatically' },
      ]));
      break;

    case 'desktop':
      container.appendChild(buildGroup([
        { label: 'Show items on Desktop', type: 'toggle', value: true },
        { label: 'Show external disks', type: 'toggle', value: true },
        { label: 'Show hard disks', type: 'toggle', value: true },
      ]));
      container.appendChild(buildGroup([
        { label: 'Position on screen', type: 'value', value: 'Bottom' },
        { label: 'Magnification', type: 'toggle', value: true },
        { label: 'Minimize using', type: 'value', value: 'Genie effect' },
      ]));
      break;

    case 'display':
      container.appendChild(buildGroup([
        { label: 'Resolution', type: 'value', value: 'Default' },
        { label: 'Brightness', type: 'value', value: '80%' },
        { label: 'True Tone', type: 'toggle', value: true },
      ]));
      container.appendChild(buildGroup([
        { label: 'Night Shift', type: 'value', value: 'Off' },
        { label: 'Refresh Rate', type: 'value', value: '60 Hertz' },
      ]));
      break;

    case 'sound':
      container.appendChild(buildGroup([
        { label: 'Output Volume', type: 'value', value: '75%' },
        { label: 'Mute', type: 'toggle', value: false },
        { label: 'Alert Sound', type: 'value', value: 'Funk' },
      ]));
      container.appendChild(buildGroup([
        { label: 'Play sound on startup', type: 'toggle', value: true },
        { label: 'Play user interface sound effects', type: 'toggle', value: true },
      ]));
      break;

    case 'network':
      container.appendChild(buildGroup([
        { label: 'Wi-Fi', type: 'toggle', value: true },
        { label: 'Network', type: 'value', value: 'Home Network' },
        { label: 'Status', type: 'value', value: 'Connected' },
      ]));
      container.appendChild(buildGroup([
        { label: 'IP Address', type: 'value', value: '192.168.1.42' },
        { label: 'Router', type: 'value', value: '192.168.1.1' },
      ]));
      break;

    case 'bluetooth':
      container.appendChild(buildGroup([
        { label: 'Bluetooth', type: 'toggle', value: true },
        { label: 'Discoverable', type: 'toggle', value: false },
      ]));
      container.appendChild(buildGroup([
        { label: 'Magic Keyboard', type: 'value', value: 'Connected' },
        { label: 'Magic Mouse', type: 'value', value: 'Connected' },
        { label: 'AirPods Pro', type: 'value', value: 'Not Connected' },
      ]));
      break;

    case 'notifications':
      container.appendChild(buildGroup([
        { label: 'Allow Notifications', type: 'toggle', value: true },
        { label: 'Show previews', type: 'value', value: 'When Unlocked' },
        { label: 'Do Not Disturb', type: 'toggle', value: false },
      ]));
      break;

    case 'about':
      container.appendChild(buildGroup([
        { label: 'Name', type: 'value', value: 'Web Desktop' },
        { label: 'macOS', type: 'value', value: 'Web Edition 1.0' },
        { label: 'Processor', type: 'value', value: 'JavaScript V8 Engine' },
        { label: 'Memory', type: 'value', value: 'Unlimited (browser)' },
      ]));
      container.appendChild(buildGroup([
        { label: 'Serial Number', type: 'value', value: 'WEB-DESK-2026' },
        { label: 'Built with', type: 'value', value: 'HTML, CSS, JavaScript' },
      ]));
      break;
  }
}

/**
 * Build a settings group with rows
 */
function buildGroup(rows) {
  const group = document.createElement('div');
  group.className = 'settings-group';

  rows.forEach(row => {
    const rowEl = document.createElement('div');
    rowEl.className = 'settings-row';

    const labelEl = document.createElement('div');
    labelEl.className = 'settings-label';
    labelEl.textContent = row.label;

    rowEl.appendChild(labelEl);

    if (row.type === 'toggle') {
      const toggle = document.createElement('div');
      toggle.className = 'settings-toggle';
      if (row.value) toggle.classList.add('active');
      toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
      });
      rowEl.appendChild(toggle);
    } else {
      const valueEl = document.createElement('div');
      valueEl.className = 'settings-value';
      valueEl.textContent = row.value;
      rowEl.appendChild(valueEl);
    }

    group.appendChild(rowEl);
  });

  return group;
}
