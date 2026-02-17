import { useCallback, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Sidebar from "../components/sidebar/Sidebar";
import AccessDeniedModal from "../components/modal/AccessDeniedModal";
import LicenseCountdownToast from "../components/LicenseCountdownToast";

import "react-toastify/dist/ReactToastify.css";
import "./Layout.css";

function NotificationBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      setVisible(true);
    }
  }, []);

  const handleEnable = useCallback(() => {
    Notification.requestPermission().then(() => setVisible(false));
  }, []);

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        left: 24,
        zIndex: 99999,
        background: "#1e293b",
        color: "#fff",
        borderRadius: 10,
        padding: "16px 20px",
        boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
        minWidth: 280,
        maxWidth: 360,
        fontFamily: "inherit",
      }}
    >
      <p style={{ margin: 0, marginBottom: 12, fontSize: 14, fontWeight: 500 }}>
        გთხოვთ ჩართოთ შეტყობინებები, რომ მიიღოთ მნიშვნელოვანი განახლებები.
      </p>
      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={handleEnable}
          style={{
            padding: "6px 16px",
            background: "#3b82f6",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
            fontWeight: 600,
            fontSize: 13,
          }}
        >
          ჩართვა
        </button>
        <button
          onClick={() => setVisible(false)}
          style={{
            padding: "6px 16px",
            background: "transparent",
            color: "#94a3b8",
            border: "1px solid #475569",
            borderRadius: 6,
            cursor: "pointer",
            fontWeight: 600,
            fontSize: 13,
          }}
        >
          არა
        </button>
      </div>
    </div>
  );
}

const Layout = () => {

  return (
    <>
      <AccessDeniedModal />
      <NotificationBanner />

      <ToastContainer position="bottom-right" autoClose={false} />
      <LicenseCountdownToast />

      <Sidebar />
      <main className="layout-main">
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
