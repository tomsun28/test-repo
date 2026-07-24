// Text Editor Application

import './text-editor.css';

export function createTextEditor() {
  const container = document.createElement('div');
  container.className = 'text-editor';

  // Toolbar
  const toolbar = document.createElement('div');
  toolbar.className = 'editor-toolbar';

  const buttons = [
    { label: 'B', action: 'bold', title: 'Bold' },
    { label: 'I', action: 'italic', title: 'Italic' },
    { label: 'U', action: 'underline', title: 'Underline' },
    { label: 'S', action: 'strikeThrough', title: 'Strikethrough' }
  ];

  buttons.forEach(btn => {
    const button = document.createElement('button');
    button.className = 'editor-btn';
    button.textContent = btn.label;
    button.title = btn.title;
    button.addEventListener('click', () => {
      document.execCommand(btn.action, false, null);
      updateButtons();
    });
    toolbar.appendChild(button);
  });

  const separator = document.createElement('div');
  separator.className = 'toolbar-separator';
  toolbar.appendChild(separator);

  // Font size selector
  const fontSize = document.createElement('select');
  fontSize.className = 'font-size-select';
  [12, 14, 16, 18, 20, 24, 28, 32].forEach(size => {
    const option = document.createElement('option');
    option.value = size;
    option.textContent = `${size}px`;
    fontSize.appendChild(option);
  });
  fontSize.value = '16';
  fontSize.addEventListener('change', () => {
    document.execCommand('fontSize', false, '7');
    const fontElements = editor.querySelectorAll('font[size="7"]');
    fontElements.forEach(el => {
      el.removeAttribute('size');
      el.style.fontSize = fontSize.value + 'px';
    });
  });
  toolbar.appendChild(fontSize);

  container.appendChild(toolbar);

  // Editor area
  const editor = document.createElement('div');
  editor.className = 'editor-content';
  editor.contentEditable = 'true';
  editor.textContent = 'Start typing here...';
  editor.addEventListener('focus', () => {
    if (editor.textContent === 'Start typing here...') {
      editor.textContent = '';
    }
  });
  editor.addEventListener('blur', () => {
    if (editor.textContent.trim() === '') {
      editor.textContent = 'Start typing here...';
    }
  });
  editor.addEventListener('keyup', updateButtons);
  editor.addEventListener('mouseup', updateButtons);

  container.appendChild(editor);

  // Status bar
  const statusBar = document.createElement('div');
  statusBar.className = 'editor-statusbar';
  const wordCount = document.createElement('span');
  wordCount.textContent = '0 words';
  statusBar.appendChild(wordCount);

  editor.addEventListener('input', () => {
    const text = editor.textContent.trim();
    const words = text ? text.split(/\s+/).length : 0;
    const chars = text.length;
    wordCount.textContent = `${words} words • ${chars} characters`;
  });

  container.appendChild(statusBar);

  function updateButtons() {
    buttons.forEach(btn => {
      const isActive = document.queryCommandState(btn.action);
      const button = toolbar.querySelector(`[data-action="${btn.action}"]`) ||
                     Array.from(toolbar.querySelectorAll('.editor-btn')).find(b => b.textContent === btn.label);
      if (button) {
        if (isActive) {
          button.classList.add('active');
        } else {
          button.classList.remove('active');
        }
      }
    });
  }

  return container;
}
