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
    <nav className="navbar navbar-expand-lg navbar-dark bg-danger py-3">
      <div className="container-fluid px-5">
        <Link className="navbar-brand fw-bold fs-3" to="/">
          🚗 PrimeDrive
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
          <ul className="navbar-nav gap-4">
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

          <div className="d-flex ms-3">
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
