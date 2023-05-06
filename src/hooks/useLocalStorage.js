import { useState, useEffect } from "react";

function getStorageValue(key, defaultValue) {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(key);
    return JSON?.parse(stored) ?? defaultValue
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
      console.log(value, '----value----')
      if (key === "JWTtoken" && value === 'undefined') localStorage.setItem(key, "");
      else localStorage.setItem(key, JSON.stringify(value));
    }
  }, [key, value]);

  return [value, setValue];
};
