// Calculator App
// macOS-style calculator with basic arithmetic operations

import './calculator.css';

/**
 * Create Calculator app content element.
 * @returns {HTMLElement}
 */
export function createCalculator() {
  const root = document.createElement('div');
  root.className = 'calculator';

  const display = document.createElement('div');
  display.className = 'calculator-display';
  display.textContent = '0';
  root.appendChild(display);

  const buttons = document.createElement('div');
  buttons.className = 'calculator-buttons';

  // Button layout: [label, type, action]
  const layout = [
    ['AC', 'function', 'clear'],
    ['±', 'function', 'negate'],
    ['%', 'function', 'percent'],
    ['÷', 'operator', '/'],
    ['7', 'number', '7'],
    ['8', 'number', '8'],
    ['9', 'number', '9'],
    ['×', 'operator', '*'],
    ['4', 'number', '4'],
    ['5', 'number', '5'],
    ['6', 'number', '6'],
    ['−', 'operator', '-'],
    ['1', 'number', '1'],
    ['2', 'number', '2'],
    ['3', 'number', '3'],
    ['+', 'operator', '+'],
    ['0', 'number zero', '0'],
    ['.', 'number', '.'],
    ['=', 'operator', '='],
  ];

  // State
  const state = {
    current: '0',
    previous: null,
    operator: null,
    justEvaluated: false,
  };

  const operatorButtons = new Map();

  layout.forEach(([label, type, action]) => {
    const btn = document.createElement('button');
    btn.className = `calc-btn ${type}`;
    btn.textContent = label;
    btn.addEventListener('click', () => handleAction(action));
    buttons.appendChild(btn);
    if (type === 'operator' && action !== '=') {
      operatorButtons.set(action, btn);
    }
  });

  root.appendChild(buttons);

  function updateDisplay() {
    let text = state.current;
    // Limit display length
    if (text.length > 12) {
      const num = parseFloat(text);
      if (!Number.isFinite(num)) {
        text = 'Error';
      } else {
        text = num.toExponential(6);
      }
    }
    display.textContent = text;

    // Shrink font based on length
    display.classList.remove('shrink-1', 'shrink-2', 'shrink-3');
    const len = text.length;
    if (len > 11) display.classList.add('shrink-3');
    else if (len > 8) display.classList.add('shrink-2');
    else if (len > 6) display.classList.add('shrink-1');
  }

  function clearOperatorHighlight() {
    operatorButtons.forEach(btn => btn.classList.remove('active'));
  }

  function handleAction(action) {
    if (action === 'clear') {
      state.current = '0';
      state.previous = null;
      state.operator = null;
      state.justEvaluated = false;
      clearOperatorHighlight();
      updateDisplay();
      return;
    }

    if (action === 'negate') {
      if (state.current !== '0') {
        state.current = state.current.startsWith('-')
          ? state.current.slice(1)
          : '-' + state.current;
      }
      updateDisplay();
      return;
    }

    if (action === 'percent') {
      const num = parseFloat(state.current);
      if (Number.isFinite(num)) {
        state.current = String(num / 100);
      }
      updateDisplay();
      return;
    }

    // Numbers
    if (/^\d$/.test(action)) {
      clearOperatorHighlight();
      if (state.current === '0' || state.justEvaluated) {
        state.current = action;
        state.justEvaluated = false;
      } else if (state.current.replace(/[-.]/g, '').length < 9) {
        state.current += action;
      }
      updateDisplay();
      return;
    }

    if (action === '.') {
      clearOperatorHighlight();
      if (state.justEvaluated) {
        state.current = '0.';
        state.justEvaluated = false;
      } else if (!state.current.includes('.')) {
        state.current += '.';
      }
      updateDisplay();
      return;
    }

    // Operators
    if (['+', '-', '*', '/'].includes(action)) {
      if (state.operator && state.previous !== null && !state.justEvaluated) {
        // Chain calculation
        const result = compute(state.previous, parseFloat(state.current), state.operator);
        state.current = formatResult(result);
        state.previous = result;
      } else {
        state.previous = parseFloat(state.current);
      }
      state.operator = action;
      state.justEvaluated = true;

      clearOperatorHighlight();
      const btn = operatorButtons.get(action);
      if (btn) btn.classList.add('active');

      updateDisplay();
      return;
    }

    if (action === '=') {
      if (state.operator && state.previous !== null) {
        const result = compute(state.previous, parseFloat(state.current), state.operator);
        state.current = formatResult(result);
        state.previous = null;
        state.operator = null;
        state.justEvaluated = true;
        clearOperatorHighlight();
        updateDisplay();
      }
    }
  }

  function compute(a, b, op) {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '*': return a * b;
      case '/': return b === 0 ? NaN : a / b;
    }
    return b;
  }

  function formatResult(num) {
    if (!Number.isFinite(num)) return 'Error';
    // Avoid floating-point noise
    const rounded = Math.round(num * 1e10) / 1e10;
    return String(rounded);
  }

  updateDisplay();
  return root;
}
