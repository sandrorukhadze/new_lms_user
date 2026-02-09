import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Sidebar from "../components/sidebar/Sidebar";
import AccessDeniedModal from "../components/modal/AccessDeniedModal";
import LicenseCountdownToast from "../components/LicenseCountdownToast";

import "react-toastify/dist/ReactToastify.css";
import "./Layout.css";

const Layout = () => {
  useEffect(() => {
    // Desktop Notification permission ერთხელ მოვთხოვოთ (თუ ჯერ არ აურჩევია)
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission().catch(() => {});
    }
  }, []);

  return (
    <>
      <AccessDeniedModal />

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
