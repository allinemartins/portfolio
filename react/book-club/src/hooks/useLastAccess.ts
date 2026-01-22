import { useEffect, useState } from "react";
import { STORAGE_KEYS } from "../constants/storageKeys";

export function useLastAccess() {
  const [lastAccess, setLastAccess] = useState<string>("");

  useEffect(() => {
    const prev = localStorage.getItem(STORAGE_KEYS.lastAccess);
    if (prev) setLastAccess(prev);
    localStorage.setItem(STORAGE_KEYS.lastAccess, new Date().toISOString());
  }, []);

  return lastAccess;
}