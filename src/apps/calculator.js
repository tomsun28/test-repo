// Calculator Application

import './calculator.css';

export function createCalculator() {
  const container = document.createElement('div');
  container.className = 'calculator';

  // Display
  const display = document.createElement('div');
  display.className = 'calc-display';
  const displayText = document.createElement('div');
  displayText.className = 'calc-display-text';
  displayText.textContent = '0';
  display.appendChild(displayText);
  container.appendChild(display);

  // Button grid
  const buttons = document.createElement('div');
  buttons.className = 'calc-buttons';

  const layout = [
    ['C', '±', '%', '÷'],
    ['7', '8', '9', '×'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '+'],
    ['0', '.', '=']
  ];

  let currentValue = '0';
  let previousValue = '';
  let operator = '';
  let shouldResetDisplay = false;

  layout.forEach((row, rowIndex) => {
    row.forEach((btnText) => {
      const button = document.createElement('button');
      button.className = 'calc-btn';
      button.textContent = btnText;

      // Style special buttons
      if (['C', '±', '%'].includes(btnText)) {
        button.classList.add('calc-btn-function');
      } else if (['÷', '×', '-', '+', '='].includes(btnText)) {
        button.classList.add('calc-btn-operator');
      }

      // Make 0 button span 2 columns
      if (btnText === '0') {
        button.classList.add('calc-btn-zero');
      }

      button.addEventListener('click', () => {
        handleButtonClick(btnText);
      });

      buttons.appendChild(button);
    });
  });

  container.appendChild(buttons);

  function handleButtonClick(value) {
    if (value === 'C') {
      clear();
    } else if (value === '±') {
      toggleSign();
    } else if (value === '%') {
      percentage();
    } else if (['÷', '×', '-', '+'].includes(value)) {
      setOperator(value);
    } else if (value === '=') {
      calculate();
    } else if (value === '.') {
      addDecimal();
    } else {
      inputDigit(value);
    }
  }

  function inputDigit(digit) {
    if (shouldResetDisplay) {
      displayText.textContent = digit;
      shouldResetDisplay = false;
    } else {
      displayText.textContent = displayText.textContent === '0' ? digit : displayText.textContent + digit;
    }
    currentValue = displayText.textContent;
  }

  function addDecimal() {
    if (shouldResetDisplay) {
      displayText.textContent = '0.';
      shouldResetDisplay = false;
    } else if (!displayText.textContent.includes('.')) {
      displayText.textContent += '.';
    }
    currentValue = displayText.textContent;
  }

  function clear() {
    currentValue = '0';
    previousValue = '';
    operator = '';
    displayText.textContent = '0';
    shouldResetDisplay = false;
  }

  function toggleSign() {
    const value = parseFloat(displayText.textContent);
    displayText.textContent = String(-value);
    currentValue = displayText.textContent;
  }

  function percentage() {
    const value = parseFloat(displayText.textContent);
    displayText.textContent = String(value / 100);
    currentValue = displayText.textContent;
  }

  function setOperator(op) {
    if (operator && !shouldResetDisplay) {
      calculate();
    }
    previousValue = currentValue;
    operator = op;
    shouldResetDisplay = true;
  }

  function calculate() {
    if (!operator || shouldResetDisplay) return;

    const prev = parseFloat(previousValue);
    const current = parseFloat(currentValue);
    let result = 0;

    switch (operator) {
      case '+':
        result = prev + current;
        break;
      case '-':
        result = prev - current;
        break;
      case '×':
        result = prev * current;
        break;
      case '÷':
        result = current !== 0 ? prev / current : 0;
        break;
    }

    displayText.textContent = String(result);
    currentValue = String(result);
    previousValue = '';
    operator = '';
    shouldResetDisplay = true;
  }

  return container;
}
