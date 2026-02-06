import { Outlet } from "react-router-dom";
import Sidebar from "../components/sidebar/Sidebar";
import AccessDeniedModal from "../components/modal/AccessDeniedModal";
import "./Layout.css";
import { ToastContainer } from "react-toastify";
import LicenseCountdownToast from "../components/LicenseCountdownToast";

const Layout = () => {
  return (
    <>
      <AccessDeniedModal />
      <ToastContainer position="bottom-right" autoClose={false} />
      <LicenseCountdownToast /> <Sidebar />
      <main className="layout-main">
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
