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
    new Notification(title, { body, requireInteraction: true });
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

  // თითო actionTime-ზე ერთხელ
  const desktopStartNotifiedRef = useRef(false);
  const desktopLastMinuteNotifiedRef = useRef(false);

  // timeouts/intervals cleanup
  const tickIntervalRef = useRef<number | null>(null);
  const lastMinuteTimeoutRef = useRef<number | null>(null);

  useBlinkingTitle(
    isUnderOneMinute,
    "⚠️ თქვენ გამოყენებული გაქვთ ლიცენზია, დარჩენილია 1 წუთზე ნაკლები დრო",
  );

  useEffect(() => {
    // reset როცა actionTime იცვლება
    if (lastActionRef.current !== actionTime) {
      if (toastIdRef.current) toast.dismiss(toastIdRef.current);
      toastIdRef.current = null;

      lastActionRef.current = actionTime;
      setIsUnderOneMinute(false);

      desktopStartNotifiedRef.current = false;
      desktopLastMinuteNotifiedRef.current = false;

      if (tickIntervalRef.current)
        window.clearInterval(tickIntervalRef.current);
      if (lastMinuteTimeoutRef.current)
        window.clearTimeout(lastMinuteTimeoutRef.current);
      tickIntervalRef.current = null;
      lastMinuteTimeoutRef.current = null;
    }

    if (!actionTime) return;

    const start = parseDate(actionTime);
    if (!start) return;

    const totalMs = TOTAL_MINUTES * 60_000;
    const endTs = start.getTime() + totalMs;

    // ✅ 1) actionTime მოვიდა → notification მაშინვე (არ აქვს მნიშვნელობა tab/ჩაკეცილი)
    if (!desktopStartNotifiedRef.current) {
      desktopStartNotifiedRef.current = true;
      showDesktopNotification("ℹ️ თქვენ გამოყენებული გაქვთ ლიცენზია");
    }

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

    // ✅ 2) დაგეგმვა: როცა დარჩება ზუსტად 60 წამი (ან თუ უკვე < 60 წამშია, მაშინვე)
    const now = Date.now();
    const lastMinuteAt = endTs - 60_000;
    const delay = Math.max(0, lastMinuteAt - now);

    lastMinuteTimeoutRef.current = window.setTimeout(() => {
      if (!desktopLastMinuteNotifiedRef.current) {
        desktopLastMinuteNotifiedRef.current = true;
        showDesktopNotification("⚠️ 1 წუთზე ნაკლები დრო დარჩა");
      }
    }, delay);

    // tick UI-ისთვის (toast/title)
    tickIntervalRef.current = window.setInterval(() => {
      const now2 = Date.now();
      const remainingMs = Math.max(0, endTs - now2);
      const remainingSec = Math.max(0, Math.ceil(remainingMs / 1000));

      const underOneMinute = remainingMs > 0 && remainingMs <= 60_000;
      setIsUnderOneMinute(underOneMinute);

      toast.update(toastIdRef.current!, {
        render: `დარჩენილია ${mmss(remainingSec)}`,
        type: underOneMinute ? "warning" : "info",
        style: {
          background: underOneMinute ? "#b45309" : "#1e293b",
          color: "#fff",
          fontWeight: 600,
          borderRadius: "10px",
          minWidth: "240px",
        },
      });

      if (remainingMs <= 0) {
        if (tickIntervalRef.current)
          window.clearInterval(tickIntervalRef.current);
        tickIntervalRef.current = null;
      }
    }, 1000);

    return () => {
      if (tickIntervalRef.current)
        window.clearInterval(tickIntervalRef.current);
      if (lastMinuteTimeoutRef.current)
        window.clearTimeout(lastMinuteTimeoutRef.current);
      tickIntervalRef.current = null;
      lastMinuteTimeoutRef.current = null;
    };
  }, [actionTime]);

  return null;
}
