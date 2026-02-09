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

function showDesktopNotification(title: string, body?: string) {
  if (!("Notification" in window)) return;
  if (Notification.permission !== "granted") return;

  try {
    new Notification(title, {
      body,
      requireInteraction: true,
    });
  } catch {
    // ignore
  }
}

export default function LicenseCountdownToast() {
  const { data } = useLicenseInfo();
  const actionTime = (data as LicenseInfo | undefined)?.actionTime ?? null;

  const toastIdRef = useRef<ReturnType<typeof toast> | null>(null);
  const lastActionRef = useRef<string | null>(null);

  const [isUnderOneMinute, setIsUnderOneMinute] = useState(false);

  // Desktop notification ერთხელ რომ გავუშვათ თითო actionTime-ზე
  const desktopNotifiedRef = useRef(false);

  // 👉 tab title blink
  useBlinkingTitle(
    isUnderOneMinute,
    "⚠️ თქვენ გამოყენებული გაქვთ ლიცენზია, დარჩენილია 1 წუთზე ნაკლები დრო",
  );

  useEffect(() => {
    // actionTime შეიცვალა → reset
    if (lastActionRef.current !== actionTime) {
      if (toastIdRef.current) toast.dismiss(toastIdRef.current);
      toastIdRef.current = null;
      lastActionRef.current = actionTime;
      setIsUnderOneMinute(false);
      desktopNotifiedRef.current = false;
    }

    if (!actionTime) return;

    const start = parseDate(actionTime);
    if (!start) return;

    const totalMs = TOTAL_MINUTES * 60_000;

    // toast ეგრევე
    toastIdRef.current = toast.info("დარჩენილია --:--", {
      autoClose: false,
      closeOnClick: false,
      draggable: false,
      theme: "colored",
      style: {
        background: "#1e293b",
        color: "#fff",
        fontWeight: 600,
        borderRadius: "10px",
        minWidth: "240px",
      },
    });

    const id = window.setInterval(() => {
      const elapsedMs = Date.now() - start.getTime();
      const remainingMs = totalMs - elapsedMs;
      const remainingSec = Math.max(0, Math.ceil(remainingMs / 1000));

      const underOneMinute = remainingMs > 0 && remainingMs < 108_000;
      setIsUnderOneMinute(underOneMinute);

      // ✅ თუ სხვა tab-ზეა და დარჩა < 1 წუთი → Desktop notification ერთხელ
      if (underOneMinute && document.hidden && !desktopNotifiedRef.current) {
        desktopNotifiedRef.current = true;

        showDesktopNotification("⚠️ 1 წუთზე ნაკლები დრო დარჩა");
      }

      toast.update(toastIdRef.current!, {
        render: `დარჩენილია ${mmss(remainingSec)}`,
        type: underOneMinute ? "warning" : "info",
        style: {
          background: underOneMinute ? "#b45309" : "#1e293b", // <1 წუთზე ნარინჯისფერი
          color: "#fff",
          fontWeight: 600,
          borderRadius: "10px",
          minWidth: "240px",
        },
      });

      if (remainingMs <= 0) {
        window.clearInterval(id);
      }
    }, 1000);

    return () => window.clearInterval(id);
  }, [actionTime]);

  return null;
}
