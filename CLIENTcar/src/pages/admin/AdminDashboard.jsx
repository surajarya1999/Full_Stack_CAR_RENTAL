import { Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import React, { useEffect, useState } from "react";
import API from "../../services/api";

function AdminDashboard() {
  const [stats, setStats] = useState({ customers: 0, staff: 0, bookings: 0 });

  const fetchStats = async () => {
    try {
      const res = await API.get("/stats");
      setStats(res.data.data);
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <>
      <div className="container py-5">
        <ToastContainer position="top-center" />
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold">Admin Dashboard</h2>
          <Link className="navbar-brand fw-bold fs-3 text-primary" to="/">
            🚗 PrimeDrive
          </Link>
        </div>

        <div className="row g-4">
          {/* Total Users */}
          <div className="col-md-4">
            <div className="card shadow-lg text-center p-4 border-0 text-white bg-gradient bg-primary">
              <h5 className="fw-semibold">👤 Total Users</h5>
              <h2 className="fw-bold display-5">{stats.customers}</h2>
            </div>
          </div>

          {/* Total Staff */}
          <div className="col-md-4">
            <div className="card shadow-lg text-center p-4 border-0 text-white bg-gradient bg-success">
              <h5 className="fw-semibold">🧑‍💼 Total Staff</h5>
              <h2 className="fw-bold display-5">{stats.staff}</h2>
            </div>
          </div>

          {/* Total Bookings */}
          <div className="col-md-4">
            <div className="card shadow-lg text-center p-4 border-0 text-white bg-gradient bg-warning">
              <h5 className="fw-semibold">🚗 Total Bookings</h5>
              <h2 className="fw-bold display-5">{stats.bookings}</h2>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminDashboard;
