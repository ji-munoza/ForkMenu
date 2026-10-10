import '@testing-library/jest-dom';

// Mock localStorage for test environments if needed
if (typeof window !== 'undefined' && !window.localStorage) {
  let store = {};
  window.localStorage = {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = String(value);
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
}
