import { Outlet, NavLink, useNavigate } from "react-router-dom";

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div
        className="bg-dark text-white p-3 d-flex flex-column justify-content-between shadow-lg"
        style={{ width: "250px", minHeight: "100vh" }}
      >
        <div>
          <h4 className="mb-4 fw-semibold border-bottom pb-2">🚗 PrimeDrive</h4>
          <ul className="nav flex-column gap-2">
            <li className="nav-item">
              <NavLink
                to="/admin/admindashboard"
                className={({ isActive }) =>
                  `nav-link rounded px-3 py-2 ${
                    isActive ? "bg-warning text-dark fw-bold" : "text-white"
                  }`
                }
              >
                📊 Dashboard
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/admin/addcars"
                className={({ isActive }) =>
                  `nav-link rounded px-3 py-2 ${
                    isActive ? "bg-warning text-dark fw-bold" : "text-white"
                  }`
                }
              >
                ➕ Add Cars
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/admin/managebookings"
                className={({ isActive }) =>
                  `nav-link rounded px-3 py-2 ${
                    isActive ? "bg-warning text-dark fw-bold" : "text-white"
                  }`
                }
              >
                📅 Manage Bookings
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/admin/managecontacts"
                className={({ isActive }) =>
                  `nav-link rounded px-3 py-2 ${
                    isActive ? "bg-warning text-dark fw-bold" : "text-white"
                  }`
                }
              >
                📞 Contacts Info
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/admin/managefeedbacks"
                className={({ isActive }) =>
                  `nav-link rounded px-3 py-2 ${
                    isActive ? "bg-warning text-dark fw-bold" : "text-white"
                  }`
                }
              >
                ⭐ View Feedbacks
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/admin/staffmanagement"
                className={({ isActive }) =>
                  `nav-link rounded px-3 py-2 ${
                    isActive ? "bg-warning text-dark fw-bold" : "text-white"
                  }`
                }
              >
                👨‍💼 Manage Staff
              </NavLink>
            </li>
          </ul>
        </div>

        {/* 🔴 Stylish Logout Section */}
        <div className="border-top pt-3">
          <button
            className="btn btn-danger w-100 fw-bold shadow-sm rounded-pill py-2"
            onClick={handleLogout}
          >
            🔒 Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 p-4 bg-light">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
