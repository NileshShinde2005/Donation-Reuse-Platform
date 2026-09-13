import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { useEffect, useState } from "react";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem("user"));
  });

  const navigate = useNavigate();

  // ==========================================
  // WATCH FOR LOGIN / LOGOUT
  // ==========================================

  useEffect(() => {
    const updateUser = () => {
      const currentUser =
        JSON.parse(localStorage.getItem("user"));

      setUser(currentUser);
    };

    // Custom event for same-tab changes
    window.addEventListener(
      "authChanged",
      updateUser
    );

    // Storage event for changes from other tabs
    window.addEventListener(
      "storage",
      updateUser
    );

    return () => {
      window.removeEventListener(
        "authChanged",
        updateUser
      );

      window.removeEventListener(
        "storage",
        updateUser
      );
    };
  }, []);

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {
    localStorage.removeItem("user");

    setUser(null);

    setMenuOpen(false);

    // Tell other components that auth changed
    window.dispatchEvent(
      new Event("authChanged")
    );

    navigate("/");
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">

      {/* Logo */}

      <div className="logo">
        <Link
          to="/"
          onClick={closeMenu}
        >
          <h2>Donation & Reuse</h2>
        </Link>
      </div>

      {/* Navigation */}

      <ul
        className={
          menuOpen
            ? "nav-links active"
            : "nav-links"
        }
      >

        {/* ================================
            GUEST NAVBAR
        ================================= */}

        {!user && (
          <>
            <li>
              <Link
                to="/"
                onClick={closeMenu}
              >
                Home
              </Link>
            </li>

            <li>
              <a
                href="/#about"
                onClick={closeMenu}
              >
                About
              </a>
            </li>

            <li>
              <a
                href="/#how-it-works"
                onClick={closeMenu}
              >
                How It Works
              </a>
            </li>

            <li>
              <a
                href="/#categories"
                onClick={closeMenu}
              >
                Categories
              </a>
            </li>

            <li>
              <a
                href="/#ngos"
                onClick={closeMenu}
              >
                NGOs
              </a>
            </li>

            <li>
              <a
                href="/#contact"
                onClick={closeMenu}
              >
                Contact
              </a>
            </li>
          </>
        )}

        {/* ================================
            LOGGED IN NAVBAR
        ================================= */}

        {user && (
          <>
            <li>
              <Link
                to="/"
                onClick={closeMenu}
              >
                Home
              </Link>
            </li>

            <li>
              <Link
                to="/requests"
                onClick={closeMenu}
          >
                Requests
                </Link>
            </li>

            <li>
              <Link
                to="/browse"
                onClick={closeMenu}
              >
                Browse
              </Link>
            </li>

            <li>
              <Link
                to="/donate"
                onClick={closeMenu}
              >
                Donate
              </Link>
            </li>

            <li>
              <Link
                to="/dashboard"
                onClick={closeMenu}
              >
                Dashboard
              </Link>
            </li>

            <li>
              <Link
                to="/profile"
                onClick={closeMenu}
              >
                Profile
              </Link>
            </li>

            <li>
              <Link
                to="/my-donations"
                onClick={closeMenu}
              >
                My Donations
              </Link>
            </li>
          </>
        )}
            <li>
              <Link
                to="/admin"
                onClick={closeMenu}
            >
              Admin
              </Link>
            </li>

      </ul>

      {/* ================================
          RIGHT SIDE
      ================================= */}

      {!user ? (

        <Link
          to="/login"
          className="login-btn"
          onClick={closeMenu}
        >
          Login
        </Link>

      ) : (

        <div className="navbar-user">

          <span className="welcome-user">
            👋 {user.name || user.email}
          </span>

          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      )}

      {/* Mobile Menu */}

      <div
        className="menu-icon"
        onClick={() =>
          setMenuOpen(!menuOpen)
        }
      >
        {menuOpen ? (
          <FaTimes />
        ) : (
          <FaBars />
        )}
      </div>

    </nav>
  );
}

export default Navbar;