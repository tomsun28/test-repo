// App Registry
// Central registry for all applications available in the system

import { createCalculatorApp } from './calculator.js';
import { createTextEditorApp } from './text-editor.js';
import { createSettingsApp } from './settings.js';

// Map of app ID to their factory function and metadata
const appRegistry = {
  calculator: {
    name: 'Calculator',
    icon: '🧮',
    factory: createCalculatorApp,
    windowOptions: { width: 320, height: 480, minWidth: 280, minHeight: 420 },
  },
  'text-editor': {
    name: 'Text Editor',
    icon: '📝',
    factory: createTextEditorApp,
    windowOptions: { width: 650, height: 500, minWidth: 400, minHeight: 300 },
  },
  settings: {
    name: 'System Settings',
    icon: '⚙️',
    factory: createSettingsApp,
    windowOptions: { width: 700, height: 500, minWidth: 550, minHeight: 400 },
  },
};

/**
 * Get app metadata by ID.
 */
export function getApp(id) {
  return appRegistry[id] || null;
}

/**
 * Get all registered apps.
 */
export function getAllApps() {
  return Object.entries(appRegistry).map(([id, app]) => ({ id, ...app }));
}

/**
 * Create the content DOM for an app.
 * @param {string} appId
 * @returns {HTMLElement}
 */
export function createAppContent(appId) {
  const app = appRegistry[appId];
  if (!app) return null;
  return app.factory();
}

/**
 * Get window options for an app.
 * @param {string} appId
 * @returns {Object}
 */
export function getAppWindowOptions(appId) {
  const app = appRegistry[appId];
  return app ? app.windowOptions : {};
}
