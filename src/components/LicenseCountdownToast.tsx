import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useLicenseInfo } from "../hooks/useLicenseInfo";
import { useBlinkingTitle } from "./useBlinkingTitle";

type LicenseInfo = { actionTime: string | null };

const TOTAL_MINUTES = 20;

function parseDate(input: string): Date | null {
  const normalized = input.replace(/(\.\d{3})\d+/, "$1");
  const d = new Date(normalized);
  return Number.isNaN(d.getTime()) ? null : d;
}

const mmss = (sec: number) =>
  `${String(Math.floor(sec / 60)).padStart(2, "0")}:${String(sec % 60).padStart(2, "0")}`;

export default function LicenseCountdownToast() {
  const { data } = useLicenseInfo();
  const actionTime = (data as LicenseInfo | undefined)?.actionTime ?? null;

  const toastIdRef = useRef<ReturnType<typeof toast> | null>(null);
  const lastActionRef = useRef<string | null>(null);

  const [isUnderOneMinute, setIsUnderOneMinute] = useState(false);

  // 👉 tab title blink
  useBlinkingTitle(isUnderOneMinute, "⚠️ 1 წუთზე ნაკლები დრო დარჩა");

  useEffect(() => {
    if (lastActionRef.current !== actionTime) {
      if (toastIdRef.current) toast.dismiss(toastIdRef.current);
      toastIdRef.current = null;
      lastActionRef.current = actionTime;
      setIsUnderOneMinute(false);
    }

    if (!actionTime) return;

    const start = parseDate(actionTime);
    if (!start) return;

    const totalMs = TOTAL_MINUTES * 60_000;

    toastIdRef.current = toast.info("დარჩენილია ...", {
      autoClose: false,
      closeOnClick: false,
      draggable: false,
    });

    const id = window.setInterval(() => {
      const elapsedMs = Date.now() - start.getTime();
      const remainingMs = totalMs - elapsedMs;
      const remainingSec = Math.max(0, Math.ceil(remainingMs / 1000));

      setIsUnderOneMinute(remainingMs > 0 && remainingMs < 60_000);

      toast.update(toastIdRef.current!, {
        render: `დარჩენილია ${mmss(remainingSec)}`,
        type:
          remainingMs <= 0
            ? "error"
            : remainingMs < 60_000
              ? "warning"
              : "info",
      });

      if (remainingMs <= 0) {
        window.clearInterval(id);
      }
    }, 1000);

    return () => window.clearInterval(id);
  }, [actionTime]);

  return null;
}
