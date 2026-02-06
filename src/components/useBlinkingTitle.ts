import { useEffect, useRef } from "react";

export function useBlinkingTitle(
  active: boolean,
  alertTitle = "⚠️ 1 წუთზე ნაკლები დრო დარჩა",
  intervalMs = 1000,
) {
  const originalTitleRef = useRef(document.title);

  useEffect(() => {
    if (!active) return;

    const original = originalTitleRef.current;
    const id = window.setInterval(() => {
      document.title = document.title === original ? alertTitle : original;
    }, intervalMs);

    return () => {
      window.clearInterval(id);
      document.title = original;
    };
  }, [active, alertTitle, intervalMs]);
}
