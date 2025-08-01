import { Outlet } from "react-router-dom";
import Sidebar from "../components/sidebar/Sidebar";
import AccessDeniedModal from "../components/modal/AccessDeniedModal";
import "./Layout.css"; // ახალ სტილებს ვაერთებთ

const Layout = () => {
  return (
    <>
      <AccessDeniedModal />
      <Sidebar />
      <main className="layout-main">
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
