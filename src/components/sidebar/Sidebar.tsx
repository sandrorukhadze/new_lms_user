import React from "react";
import "./Sidebar.css";
import { NavLink } from "react-router-dom";
import { FaUser, FaSignOutAlt } from "react-icons/fa";
import logo from "../../assets/images/sidebar.png";
import keycloak from "../../keycloack/keycloak";

interface MenuItem {
  label: string;
  to: string;
  icon: React.ReactElement;
}

const menuItems: MenuItem[] = [
  {
    label: "ჩემი გვერდი",
    to: "/me",
    icon: <FaUser className="nav-icon" />,
  },
];

const Sidebar: React.FC = () => {
  const handleLogout = () => {
    keycloak.logout({
      redirectUri: window.location.origin, // ✅ სწორად მითითებული redirect
    });
  };

  return (
    <aside className="new-sidebar">
      <div className="sidebar-top">
        <img src={logo} alt="Logo" className="sidebar-logo" />
      </div>

      <nav className="nav-menu">
        {menuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt className="nav-icon" />
          <span>გასვლა</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
