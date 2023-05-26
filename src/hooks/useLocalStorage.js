import { useState, useEffect } from "react";

function getStorageValue(key, defaultValue) {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(key);
    return stored !== "undefined" && stored !== null
      ? JSON?.parse(stored)
      : defaultValue;
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

  if (typeof window !== "undefined" && typeof localStorage === "undefined")
    return null;

  return [value, setValue];
};
