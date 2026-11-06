import { useState, useEffect } from 'react';

/**
 * Custom hook with identical call signature to useState that synchronizes
 * its state with window.localStorage safely.
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const storedItem = window.localStorage.getItem(key);
      if (storedItem === null) {
        return initialValue;
      }
      return JSON.parse(storedItem);
    } catch (err) {
      console.warn(`Error reading localStorage key "${key}":`, err);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.error(`Error writing to localStorage key "${key}":`, err);
    }
  }, [key, value]);

  return [value, setValue];
}
