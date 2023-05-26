import { useState, useEffect } from "react";

function getStorageValue(key, defaultValue) {
  if (
    typeof window !== "undefined" &&
    typeof window?.localStorage !== "undefined"
  ) {
    const stored = window?.localStorage?.getItem(key);
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
        typeof window?.localStorage !== "undefined" &&
          localStorage?.setItem(key, JSON.stringify(value));
      }
    } else {
      typeof window !== "undefined" &&
        window?.localStorage?.setItem(key, JSON.stringify(value));
    }
  }, [key, value]);

  return [value, setValue];
};
