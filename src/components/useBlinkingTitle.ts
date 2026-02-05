import { useEffect, useRef } from "react";

export function useBlinkingTitle(
  shouldBlink: boolean,
  alertTitle: string = "⚠️ უმოქმედობა დაფიქსირდა",
  intervalMs: number = 100,
) {
  const originalTitleRef = useRef<string>(document.title);

  useEffect(() => {
    if (!shouldBlink) return;

    const original = originalTitleRef.current;

    const id = window.setInterval(() => {
      document.title = document.title === original ? alertTitle : original;
    }, intervalMs);

    return () => {
      window.clearInterval(id);
      document.title = original;
    };
  }, [shouldBlink, alertTitle, intervalMs]);
}
