// Text Editor App
// Simple text editor with basic file operations

import './text-editor.css';
import { createWindow } from '../window-manager.js';

/**
 * Open Text Editor app
 */
export function openTextEditor() {
  const container = document.createElement('div');
  container.className = 'text-editor';

  // Toolbar
  const toolbar = document.createElement('div');
  toolbar.className = 'editor-toolbar';

  const newBtn = document.createElement('button');
  newBtn.className = 'editor-btn';
  newBtn.textContent = 'New';

  const openBtn = document.createElement('button');
  openBtn.className = 'editor-btn';
  openBtn.textContent = 'Open';

  const saveBtn = document.createElement('button');
  saveBtn.className = 'editor-btn primary';
  saveBtn.textContent = 'Save';

  toolbar.appendChild(newBtn);
  toolbar.appendChild(openBtn);
  toolbar.appendChild(saveBtn);

  // Textarea
  const textarea = document.createElement('textarea');
  textarea.className = 'editor-textarea';
  textarea.placeholder = 'Start typing...';
  textarea.value = 'Welcome to Text Editor!\n\nThis is a simple text editor for creating and editing text files.\n\nFeatures:\n- Create new documents\n- Edit text with monospace font\n- Track word and character count';

  // Status bar
  const status = document.createElement('div');
  status.className = 'editor-status';

  const info = document.createElement('span');
  info.textContent = 'Ready';

  const stats = document.createElement('span');
  updateStats(textarea, stats);

  status.appendChild(info);
  status.appendChild(stats);

  textarea.addEventListener('input', () => updateStats(textarea, stats));

  // Button handlers
  newBtn.addEventListener('click', () => {
    textarea.value = '';
    updateStats(textarea, stats);
    info.textContent = 'New document created';
  });

  openBtn.addEventListener('click', () => {
    info.textContent = 'Open file (demo)';
  });

  saveBtn.addEventListener('click', () => {
    info.textContent = 'File saved (demo)';
  });

  container.appendChild(toolbar);
  container.appendChild(textarea);
  container.appendChild(status);

  return createWindow({
    title: 'Text Editor',
    content: container,
    width: 600,
    height: 500,
    minWidth: 400,
    minHeight: 300,
  });
}

/**
 * Update word and character count
 */
function updateStats(textarea, statsEl) {
  const text = textarea.value;
  const chars = text.length;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const lines = text.split('\n').length;
  statsEl.textContent = `${words} words | ${chars} chars | ${lines} lines`;
}
