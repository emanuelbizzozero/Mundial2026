// A safe wrapper for localStorage that falls back to in-memory storage 
// if localStorage is blocked by browser security settings (e.g. Incognito mode, embedded webviews).

const memoryStore = {};

const getLocalStorage = () => {
  try {
    return window.localStorage;
  } catch (e) {
    return null;
  }
};

export const safeStorage = {
  getItem: (key) => {
    try {
      const storage = getLocalStorage();
      if (storage) {
        return storage.getItem(key);
      }
    } catch (e) {
      console.warn(`Error reading key "${key}" from localStorage:`, e);
    }
    return memoryStore[key] || null;
  },

  setItem: (key, value) => {
    try {
      const storage = getLocalStorage();
      if (storage) {
        storage.setItem(key, value);
        return;
      }
    } catch (e) {
      console.warn(`Error writing key "${key}" to localStorage:`, e);
    }
    memoryStore[key] = String(value);
  },

  removeItem: (key) => {
    try {
      const storage = getLocalStorage();
      if (storage) {
        storage.removeItem(key);
        return;
      }
    } catch (e) {
      console.warn(`Error removing key "${key}" from localStorage:`, e);
    }
    delete memoryStore[key];
  }
};
