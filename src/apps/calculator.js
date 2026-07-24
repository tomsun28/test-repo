// Calculator App
// macOS-style calculator with basic arithmetic operations

import './calculator.css';
import { createWindow } from '../window-manager.js';

let currentDisplay = '0';
let previousValue = null;
let operation = null;
let shouldResetDisplay = false;
let expression = '';

/**
 * Open Calculator app
 */
export function openCalculator() {
  const container = document.createElement('div');
  container.className = 'calculator';

  // Display
  const display = document.createElement('div');
  display.className = 'calc-display';

  const expressionEl = document.createElement('div');
  expressionEl.className = 'calc-expression';
  expressionEl.textContent = '';

  const resultEl = document.createElement('div');
  resultEl.className = 'calc-result';
  resultEl.textContent = '0';

  display.appendChild(expressionEl);
  display.appendChild(resultEl);

  // Buttons grid
  const buttons = document.createElement('div');
  buttons.className = 'calc-buttons';

  const buttonLayout = [
    ['C', 'fn'], ['±', 'fn'], ['%', 'fn'], ['÷', 'op'],
    ['7', ''], ['8', ''], ['9', ''], ['×', 'op'],
    ['4', ''], ['5', ''], ['6', ''], ['−', 'op'],
    ['1', ''], ['2', ''], ['3', ''], ['+', 'op'],
    ['0', 'zero'], ['.', ''], ['=', 'op']
  ];

  buttonLayout.forEach(([label, className]) => {
    const btn = document.createElement('button');
    btn.className = `calc-btn ${className}`.trim();
    btn.textContent = label;
    btn.addEventListener('click', () => handleCalcButton(label, resultEl, expressionEl));
    buttons.appendChild(btn);
  });

  container.appendChild(display);
  container.appendChild(buttons);

  return createWindow({
    title: 'Calculator',
    content: container,
    width: 280,
    height: 420,
    minWidth: 280,
    minHeight: 420,
  });
}

/**
 * Handle calculator button press
 */
function handleCalcButton(label, resultEl, expressionEl) {
  if (label >= '0' && label <= '9') {
    handleNumber(label, resultEl);
  } else if (label === '.') {
    handleDecimal(resultEl);
  } else if (label === 'C') {
    handleClear(resultEl, expressionEl);
  } else if (label === '±') {
    handleSignChange(resultEl);
  } else if (label === '%') {
    handlePercent(resultEl);
  } else if (['+', '−', '×', '÷'].includes(label)) {
    handleOperator(label, resultEl, expressionEl);
  } else if (label === '=') {
    handleEquals(resultEl, expressionEl);
  }
}

function handleNumber(num, resultEl) {
  if (shouldResetDisplay) {
    currentDisplay = num;
    shouldResetDisplay = false;
  } else {
    currentDisplay = currentDisplay === '0' ? num : currentDisplay + num;
  }
  resultEl.textContent = currentDisplay;
}

function handleDecimal(resultEl) {
  if (shouldResetDisplay) {
    currentDisplay = '0.';
    shouldResetDisplay = false;
  } else if (!currentDisplay.includes('.')) {
    currentDisplay += '.';
  }
  resultEl.textContent = currentDisplay;
}

function handleClear(resultEl, expressionEl) {
  currentDisplay = '0';
  previousValue = null;
  operation = null;
  shouldResetDisplay = false;
  expression = '';
  resultEl.textContent = '0';
  expressionEl.textContent = '';
}

function handleSignChange(resultEl) {
  currentDisplay = currentDisplay.startsWith('-')
    ? currentDisplay.slice(1)
    : '-' + currentDisplay;
  resultEl.textContent = currentDisplay;
}

function handlePercent(resultEl) {
  currentDisplay = String(parseFloat(currentDisplay) / 100);
  resultEl.textContent = currentDisplay;
}

function handleOperator(op, resultEl, expressionEl) {
  const currentValue = parseFloat(currentDisplay);

  if (previousValue !== null && !shouldResetDisplay) {
    const result = calculate(previousValue, currentValue, operation);
    currentDisplay = String(result);
    resultEl.textContent = currentDisplay;
    previousValue = result;
  } else {
    previousValue = currentValue;
  }

  operation = op;
  shouldResetDisplay = true;
  expression = `${previousValue} ${op}`;
  expressionEl.textContent = expression;
}

function handleEquals(resultEl, expressionEl) {
  if (operation === null || previousValue === null) return;

  const currentValue = parseFloat(currentDisplay);
  const result = calculate(previousValue, currentValue, operation);

  expression = `${previousValue} ${operation} ${currentValue} =`;
  expressionEl.textContent = expression;

  currentDisplay = String(result);
  resultEl.textContent = currentDisplay;
  previousValue = null;
  operation = null;
  shouldResetDisplay = true;
}

function calculate(a, b, op) {
  switch (op) {
    case '+': return a + b;
    case '−': return a - b;
    case '×': return a * b;
    case '÷': return b !== 0 ? a / b : 'Error';
    default: return b;
  }
}
