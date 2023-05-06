import { useState, useEffect } from "react";

function getStorageValue(key, defaultValue) {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(key);
    if (key === "docParams") return defaultValue;
    return JSON?.parse(stored) ?? defaultValue;
  }

  return null;
}

export const useLocalStorage = (key, defaultValue) => {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    setValue(getStorageValue(key, defaultValue));
  }, []);

  useEffect(() => {
    if (key === "selectedItem") {
      if (Object.keys(value)?.length > 0) {
        localStorage.setItem(key, JSON.stringify(value));
      }
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }, [key, value]);

  return [value, setValue];
};
