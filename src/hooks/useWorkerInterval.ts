import { useEffect, useRef } from "react";

export const useWorkerInterval = (callback: () => void, interval: number) => {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    const worker = new Worker(
      new URL("../workers/pollingWorker.ts", import.meta.url),
      { type: "module" }
    );
    worker.postMessage({ type: "start", interval });
    worker.onmessage = () => callbackRef.current();
    return () => {
      worker.postMessage({ type: "stop" });
      worker.terminate();
    };
  }, [interval]);
};
