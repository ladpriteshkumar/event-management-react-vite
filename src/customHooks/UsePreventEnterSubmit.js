import { useCallback } from "react";

export function usePreventEnterSubmit() {
  return useCallback(e => {
    if (e.key === "Enter" && e.target.tagName !== "TEXTAREA") {
      e.preventDefault();
    }
  }, []);
}
