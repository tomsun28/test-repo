// Text Editor App
// Simple text editor with basic file operations

import './text-editor.css';

/**
 * Create Text Editor app content element.
 * @returns {HTMLElement}
 */
export function createTextEditor() {
  const root = document.createElement('div');
  root.className = 'text-editor';

  // Toolbar
  const toolbar = document.createElement('div');
  toolbar.className = 'text-editor-toolbar';

  const newBtn = document.createElement('button');
  newBtn.textContent = 'New';
  newBtn.addEventListener('click', handleNew);
  toolbar.appendChild(newBtn);

  const saveBtn = document.createElement('button');
  saveBtn.textContent = 'Save';
  saveBtn.addEventListener('click', handleSave);
  toolbar.appendChild(saveBtn);

  const clearBtn = document.createElement('button');
  clearBtn.textContent = 'Clear';
  clearBtn.addEventListener('click', handleClear);
  toolbar.appendChild(clearBtn);

  root.appendChild(toolbar);

  // Textarea
  const textarea = document.createElement('textarea');
  textarea.className = 'text-editor-textarea';
  textarea.placeholder = 'Start typing...';
  textarea.addEventListener('input', updateStatus);
  root.appendChild(textarea);

  // Status bar
  const status = document.createElement('div');
  status.className = 'text-editor-status';
  
  const charCount = document.createElement('span');
  charCount.textContent = '0 characters';
  status.appendChild(charCount);

  const lineCount = document.createElement('span');
  lineCount.textContent = '1 line';
  status.appendChild(lineCount);

  root.appendChild(status);

  // State
  const state = {
    filename: 'untitled.txt',
  };

  function updateStatus() {
    const text = textarea.value;
    const chars = text.length;
    const lines = text.split('\n').length;
    charCount.textContent = `${chars} character${chars !== 1 ? 's' : ''}`;
    lineCount.textContent = `${lines} line${lines !== 1 ? 's' : ''}`;
  }

  function handleNew() {
    if (textarea.value && !confirm('Discard current document?')) return;
    textarea.value = '';
    state.filename = 'untitled.txt';
    updateStatus();
  }

  function handleSave() {
    const text = textarea.value;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = state.filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleClear() {
    if (textarea.value && !confirm('Clear all text?')) return;
    textarea.value = '';
    updateStatus();
  }

  updateStatus();
  return root;
}
