import { Outlet } from "react-router-dom";
import Sidebar from "../components/sidebar/Sidebar";
import AccessDeniedModal from "../components/modal/AccessDeniedModal";

const Layout = () => {
  return (
    <>
      <AccessDeniedModal />
      <Sidebar />
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
