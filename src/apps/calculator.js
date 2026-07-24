// Calculator App
// Simple calculator with basic arithmetic operations

export function createCalculatorApp() {
  const container = document.createElement('div');
  container.className = 'calculator-app';
  container.style.cssText = `
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 16px;
    background: #1e1e1e;
    color: white;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  `;

  // Display
  const display = document.createElement('div');
  display.style.cssText = `
    background: #2d2d2d;
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 16px;
    text-align: right;
    font-size: 36px;
    font-weight: 300;
    min-height: 80px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    overflow: hidden;
  `;
  display.textContent = '0';

  // Calculator state
  let currentValue = '0';
  let previousValue = '';
  let operation = null;
  let shouldResetDisplay = false;

  function updateDisplay() {
    display.textContent = currentValue;
  }

  function handleNumber(num) {
    if (shouldResetDisplay) {
      currentValue = num;
      shouldResetDisplay = false;
    } else {
      currentValue = currentValue === '0' ? num : currentValue + num;
    }
    updateDisplay();
  }

  function handleOperation(op) {
    if (operation && !shouldResetDisplay) {
      calculate();
    }
    previousValue = currentValue;
    operation = op;
    shouldResetDisplay = true;
  }

  function calculate() {
    if (!operation || !previousValue) return;
    
    const prev = parseFloat(previousValue);
    const current = parseFloat(currentValue);
    let result = 0;

    switch (operation) {
      case '+': result = prev + current; break;
      case '-': result = prev - current; break;
      case '×': result = prev * current; break;
      case '÷': result = current !== 0 ? prev / current : 'Error'; break;
    }

    currentValue = result.toString();
    operation = null;
    previousValue = '';
    shouldResetDisplay = true;
    updateDisplay();
  }

  function clear() {
    currentValue = '0';
    previousValue = '';
    operation = null;
    shouldResetDisplay = false;
    updateDisplay();
  }

  // Button grid
  const buttonGrid = document.createElement('div');
  buttonGrid.style.cssText = `
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
    flex: 1;
  `;

  const buttons = [
    ['C', '±', '%', '÷'],
    ['7', '8', '9', '×'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '+'],
    ['0', '.', '=']
  ];

  buttons.forEach((row, rowIndex) => {
    row.forEach((btn, colIndex) => {
      const button = document.createElement('button');
      button.textContent = btn;
      button.style.cssText = `
        border: none;
        border-radius: 50%;
        font-size: 24px;
        font-weight: 400;
        cursor: pointer;
        transition: all 0.15s;
        aspect-ratio: 1;
        ${btn === '0' && colIndex === 0 ? 'grid-column: span 2; border-radius: 32px; aspect-ratio: auto;' : ''}
        ${['÷', '×', '-', '+', '='].includes(btn) ? 'background: #ff9500; color: white;' : ''}
        ${['C', '±', '%'].includes(btn) ? 'background: #a5a5a5; color: black;' : ''}
        ${!['÷', '×', '-', '+', '=', 'C', '±', '%'].includes(btn) ? 'background: #333; color: white;' : ''}
      `;

      button.addEventListener('click', () => {
        if (btn >= '0' && btn <= '9') handleNumber(btn);
        else if (btn === '.') handleNumber('.');
        else if (btn === 'C') clear();
        else if (btn === '±') {
          currentValue = (parseFloat(currentValue) * -1).toString();
          updateDisplay();
        }
        else if (btn === '%') {
          currentValue = (parseFloat(currentValue) / 100).toString();
          updateDisplay();
        }
        else if (btn === '=') calculate();
        else handleOperation(btn);
      });

      button.addEventListener('mouseenter', () => {
        button.style.opacity = '0.8';
      });
      button.addEventListener('mouseleave', () => {
        button.style.opacity = '1';
      });

      buttonGrid.appendChild(button);
    });
  });

  container.appendChild(display);
  container.appendChild(buttonGrid);

  // Add styles
  const style = document.createElement('style');
  style.textContent = `
    .calculator-app button:active {
      transform: scale(0.95);
    }
  `;
  container.appendChild(style);

  return container;
}
