import React, { useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";

function Navbar() {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:3000/api/logout", {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
      navigate("/");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark py-3"
      style={{
        background: "rgba(27, 26, 26, 0.2)",
        backdropFilter: "blur(2px)",
        WebkitBackdropFilter: "blur(1px)",
        borderBottom: "1px solid rgba(94, 90, 90, 0.2)",
        position: "fixed",
        width: "100%",
        height: "80px",
        top: 0,
        zIndex: 999,
      }}
    >
      <style>
        {`
  .navbar-nav .nav-link {
    transition: color 0.3s ease-in-out;
  }
  .navbar-nav .nav-link:hover {
    color: #fae104ff !important;
  }

  /* MOBILE RESPONISVE LOGO */
  @media (max-width: 768px) {
    .navbar-brand img {
      height: 55px !important;
    }
  }

  /* ⭐ FULL-WIDTH BACKGROUND + BLUR ⭐ */
  @media (max-width: 991px) {
    .navbar-collapse {
      position: absolute !important;
      top: 100%;
      left: 0;
      width: 100% !important;

      background: rgba(0, 0, 0, 0.75) !important;
      backdrop-filter: blur(15px) !important;
      -webkit-backdrop-filter: blur(15px) !important;

      padding: 15px;
      border-radius: 0;   /* pura rectangle */
      margin: 0 !important; /* left-right gap 0 */
      z-index: 999;
    }

    .navbar-nav .nav-link {
      color: white !important;
    }
  }
`}
      </style>

      <div className="container-fluid px-4">
        <Link className="navbar-brand" to="/">
          <img src="/logo.png" alt="Logo" style={{ height: "85px" }} />
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="collapse navbar-collapse justify-content-end"
          id="navbarNav"
        >
          <ul className="navbar-nav gap-3 text-center">
            <li className="nav-item">
              <Link className="nav-link text-white fw-semibold fs-5" to="/">
                Home
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link text-white fw-semibold fs-5" to="/cars">
                Cars
              </Link>
            </li>

            <li className="nav-item">
              <Link
                className="nav-link text-white fw-semibold fs-5"
                to="/contact"
              >
                Contact
              </Link>
            </li>

            {user && user.role === "customer" && (
              <li className="nav-item">
                <Link
                  className="nav-link text-white fw-semibold fs-5"
                  to="/mybooking"
                >
                  My Bookings
                </Link>
              </li>
            )}

            <li className="nav-item">
              <Link
                className="nav-link text-white fw-semibold fs-5"
                to="/feedback"
              >
                Feedback
              </Link>
            </li>
          </ul>

          <div className="d-flex ms-lg-3 mt-3 mt-lg-0 justify-content-center">
            {!user ? (
              <>
                <Link to="/login" className="btn btn-outline-light me-2">
                  Login
                </Link>
                <Link to="/register" className="btn btn-light">
                  Register
                </Link>
              </>
            ) : (
              <div className="dropdown">
                <button
                  className="btn btn-outline-light dropdown-toggle"
                  type="button"
                  id="userDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {user?.name || "Account"}
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  {user?.role === "admin" && (
                    <li>
                      <Link className="dropdown-item" to="/admin/dashboard">
                        Dashboard
                      </Link>
                    </li>
                  )}
                  <li>
                    <Link className="dropdown-item" to="/change-password">
                      Change Password
                    </Link>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <button
                      className="dropdown-item text-danger"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
