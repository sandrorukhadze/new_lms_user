import { Outlet } from "react-router-dom";
import Sidebar from "../components/sidebar/Sidebar";
import AccessDeniedModal from "../components/modal/AccessDeniedModal";
import "./Layout.css";
import LicenseInactivityModal from "../components/LicenseInactivityModal";

const Layout = () => {
  return (
    <>
      <AccessDeniedModal />
      <LicenseInactivityModal /> {/* 👈 აქ */}
      <Sidebar />
      <main className="layout-main">
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
