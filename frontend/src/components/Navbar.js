import React, { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaBars, FaTimes, FaUserCircle } from "react-icons/fa";
import "../styles/Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const role = localStorage.getItem("role"); // student | parent | consultant | admin

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileProfileOpen, setMobileProfileOpen] = useState(false);
  const profileRef = useRef();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    localStorage.clear();
    alert("👋 You have been logged out.");
    navigate("/login");
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    setShowLogoutConfirm(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setDropdownOpen(false);
        setMobileProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="navbar-logo">
        <NavLink to="/" className="logo-link">
          <img src="logo.png" alt="CareerGenAI Logo" className="logo-image" />
          <span className="logo-text">CareerGenAI</span>
        </NavLink>
      </div>

      {/* =========================
          DESKTOP LINKS
      ========================= */}
      <ul className="navbar-links desktop">
        <li>
          <NavLink to="/" end>
            Home
          </NavLink>
        </li>

        {/* STUDENT */}
        {role === "student" && (
          <li>
            <NavLink to="/services">Services</NavLink>
          </li>
        )}

        {/* PARENT */}
        {role === "parent" && (
          <li>
            <NavLink to="/parent-dashboard">Dashboard</NavLink>
          </li>
        )}

        {/* CONSULTANT */}
        {role === "consultant" && (
          <li>
            <NavLink to="/consultant-dashboard">Dashboard</NavLink>
          </li>
        )}

        {/* ADMIN */}
        {role === "admin" && (
          <li>
            <NavLink to="/admin-dashboard">Admin Dashboard</NavLink>
          </li>
        )}
      </ul>

      {/* =========================
          DESKTOP PROFILE
      ========================= */}
      <div className="navbar-auth desktop" ref={profileRef}>
        <div className="flex flex-row items-center gap-2 text-white text-lg font-medium">
          <a href="tel:+919619901999">+91 9619901999</a>
          <a href="tel:+918657869659">+91 8657869659</a>
        </div>

        {!user ? (
          <>
            <NavLink to="/login" className="auth-button">
              Login
            </NavLink>
            <NavLink to="/register" className="auth-button register">
              Register
            </NavLink>
            <NavLink to="/register-consultant" className="auth-button register">
              Register as Consultant
            </NavLink>
          </>
        ) : (
          <>
            <FaUserCircle
              className="profile-icon"
              size={28}
              onClick={() => setDropdownOpen(!dropdownOpen)}
            />
            {dropdownOpen && (
              <div className="dropdown-menu">
                <button onClick={() => navigate("/profile")}>
                  See Profile
                </button>

                {/* STUDENT */}
                {role === "student" && (
                  <>
                    <button onClick={() => navigate("/history")}>
                      History
                    </button>
                    <button onClick={() => navigate("/my-activity")}>
                      My Activity
                    </button>
                  </>
                )}

                {/* PARENT */}
                {role === "parent" && (
                  <button onClick={() => navigate("/parent-dashboard")}>
                    Parent Dashboard
                  </button>
                )}

                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </>
        )}
      </div>

      {/* =========================
          MOBILE HAMBURGER
      ========================= */}
      <div
        className="hamburger"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </div>

      {/* =========================
          MOBILE MENU
      ========================= */}
      {mobileMenuOpen && (
        <div className="mobile-menu">
          <ul>
            <li>
              <NavLink to="/" onClick={() => setMobileMenuOpen(false)}>
                Home
              </NavLink>
            </li>

            {/* STUDENT */}
            {role === "student" && (
              <li>
                <NavLink
                  to="/services"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Services
                </NavLink>
              </li>
            )}

            {/* PARENT */}
            {role === "parent" && (
              <li>
                <NavLink
                  to="/parent-dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </NavLink>
              </li>
            )}

            {/* CONSULTANT */}
            {role === "consultant" && (
              <li>
                <NavLink
                  to="/consultant-dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </NavLink>
              </li>
            )}

            {/* ADMIN */}
            {role === "admin" && (
              <li>
                <NavLink
                  to="/admin-dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Admin Dashboard
                </NavLink>
              </li>
            )}

            {user ? (
              <div className="mobile-profile" ref={profileRef}>
                <li onClick={() => setMobileProfileOpen(!mobileProfileOpen)}>
                  Profile
                </li>

                {mobileProfileOpen && (
                  <div className="mobile-submenu">
                    <li
                      onClick={() => {
                        navigate("/profile");
                        setMobileMenuOpen(false);
                        setMobileProfileOpen(false);
                      }}
                    >
                      See Profile
                    </li>

                    {/* STUDENT */}
                    {role === "student" && (
                      <>
                        <li onClick={() => navigate("/history")}>
                          History
                        </li>
                        <li onClick={() => navigate("/my-activity")}>
                          My Activity
                        </li>
                      </>
                    )}

                    {/* PARENT */}
                    {role === "parent" && (
                      <li onClick={() => navigate("/parent-dashboard")}>
                        Parent Dashboard
                      </li>
                    )}

                    <li onClick={handleLogout}>Logout</li>
                  </div>
                )}
              </div>
            ) : (
              <div className="mobile-profile">
                <NavLink to="/login" className="auth-button">
                  Login
                </NavLink>
                <NavLink to="/register" className="auth-button register">
                  Register
                </NavLink>
                <NavLink
                  to="/register-consultant"
                  className="auth-button register"
                >
                  Register as Consultant
                </NavLink>
              </div>
            )}
          </ul>
        </div>
      )}

      {/* =========================
          LOGOUT CONFIRMATION
      ========================= */}
      {showLogoutConfirm && (
        <div className="logout-confirm-overlay">
          <div className="logout-confirm-box">
            <p>Are you sure you want to logout?</p>
            <div className="logout-buttons">
              <button className="yes-btn" onClick={confirmLogout}>
                Yes
              </button>
              <button onClick={() => setShowLogoutConfirm(false)}>
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
