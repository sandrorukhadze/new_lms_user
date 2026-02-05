import { useEffect, useRef, useState } from "react";

const MINUTE_MS = 60_000;

function parseBackendDate(input: string): Date | null {
  const s = input.trim();
  const normalized = s.replace(/(\.\d{3})\d+/, "$1");
  const d = new Date(normalized);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function useLicenseInactivityWarning(
  actionTime: string | null | undefined,
  inactiveMinutes: number = 5,
) {
  const [showWarning, setShowWarning] = useState(false);
  const hasShownRef = useRef(false);

  useEffect(() => {
    setShowWarning(false);
    hasShownRef.current = false;

    if (!actionTime) return;

    const startTime = parseBackendDate(actionTime);
    if (!startTime) return;

    const thresholdMs = inactiveMinutes * MINUTE_MS;

    const id = window.setInterval(() => {
      const elapsedMs = Date.now() - startTime.getTime();

      if (elapsedMs >= thresholdMs && !hasShownRef.current) {
        hasShownRef.current = true;
        setShowWarning(true);
        window.clearInterval(id);
      }
    }, 1000);

    return () => window.clearInterval(id);
  }, [actionTime, inactiveMinutes]);

  return { showWarning, close: () => setShowWarning(false) };
}
