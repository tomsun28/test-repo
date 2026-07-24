// Text Editor App
// Simple text editor with basic formatting

export function createTextEditorApp() {
  const container = document.createElement('div');
  container.className = 'text-editor-app';
  container.style.cssText = `
    display: flex;
    flex-direction: column;
    height: 100%;
    background: white;
  `;

  // Toolbar
  const toolbar = document.createElement('div');
  toolbar.style.cssText = `
    display: flex;
    gap: 8px;
    padding: 12px;
    border-bottom: 1px solid #e0e0e0;
    background: #f5f5f5;
  `;

  const buttons = [
    { label: 'B', style: 'font-weight: bold;', command: 'bold' },
    { label: 'I', style: 'font-style: italic;', command: 'italic' },
    { label: 'U', style: 'text-decoration: underline;', command: 'underline' },
  ];

  buttons.forEach(({ label, style, command }) => {
    const btn = document.createElement('button');
    btn.textContent = label;
    btn.style.cssText = `
      border: 1px solid #ccc;
      background: white;
      padding: 6px 12px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      ${style}
      transition: all 0.15s;
    `;

    btn.addEventListener('click', () => {
      document.execCommand(command, false, null);
      editor.focus();
    });

    btn.addEventListener('mouseenter', () => {
      btn.style.background = '#e8e8e8';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.background = 'white';
    });

    toolbar.appendChild(btn);
  });

  // Clear button
  const clearBtn = document.createElement('button');
  clearBtn.textContent = 'Clear';
  clearBtn.style.cssText = `
    border: 1px solid #ccc;
    background: white;
    padding: 6px 12px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    margin-left: auto;
    transition: all 0.15s;
  `;
  clearBtn.addEventListener('click', () => {
    if (confirm('Clear all text?')) {
      editor.innerHTML = '';
      editor.focus();
    }
  });
  clearBtn.addEventListener('mouseenter', () => {
    clearBtn.style.background = '#e8e8e8';
  });
  clearBtn.addEventListener('mouseleave', () => {
    clearBtn.style.background = 'white';
  });
  toolbar.appendChild(clearBtn);

  // Editor area
  const editor = document.createElement('div');
  editor.contentEditable = 'true';
  editor.style.cssText = `
    flex: 1;
    padding: 20px;
    outline: none;
    font-size: 14px;
    line-height: 1.6;
    overflow-y: auto;
  `;
  editor.innerHTML = '<p>Start typing...</p>';

  // Word count
  const statusBar = document.createElement('div');
  statusBar.style.cssText = `
    padding: 8px 12px;
    border-top: 1px solid #e0e0e0;
    background: #f5f5f5;
    font-size: 12px;
    color: #666;
  `;

  function updateWordCount() {
    const text = editor.innerText || '';
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const chars = text.length;
    statusBar.textContent = `${words} words, ${chars} characters`;
  }

  editor.addEventListener('input', updateWordCount);
  updateWordCount();

  container.appendChild(toolbar);
  container.appendChild(editor);
  container.appendChild(statusBar);

  return container;
}
