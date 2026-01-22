import { useEffect } from "react";

export function useSidebar() {
  const open = () => document.body.classList.add("sidebarOpen");
  const close = () => document.body.classList.remove("sidebarOpen");

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return { open, close };
}