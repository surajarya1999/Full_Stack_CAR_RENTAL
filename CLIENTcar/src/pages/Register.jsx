import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../services/api";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaHome,
  FaIdBadge,
  FaBuilding,
  FaKey,
} from "react-icons/fa";

function Register() {
  const navigate = useNavigate();
  const [role, setRole] = useState("customer");
  const [loading, setLoading] = useState(false);
  const [adminExists, setAdminExists] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    number: "",
    address: "",
    dob: "",
    staffId: "",
    department: "",
    designation: "",
    superAccess: false,
    permissions: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // ✅ Check if admin exists when role is "admin"
  useEffect(() => {
    const checkAdmin = async () => {
      if (role === "admin") {
        try {
          const res = await API.get("/admin/check");
          setAdminExists(res.data.exists);
        } catch (err) {
          console.error(err);
        }
      } else {
        setAdminExists(false); // reset when switching role
      }
    };

    checkAdmin();
  }, [role]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (role === "admin" && adminExists) {
      toast.error("Admin already registered. You cannot register again.");
      return;
    }

    setLoading(true);
    try {
      const endpoint = `/register/${role}`;
      const res = await API.post(endpoint, { ...formData });
      toast.success(res.data.message || "Registration successful");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="d-flex align-items-center justify-content-center animated-bg"
      style={{ minHeight: "100vh" }}
    >
      <style>
        {`
      /* Animated Gradient Background (red-black scheme) */
      .animated-bg {
        background: linear-gradient(-45deg, #ff0d0dff, #1a1a1a, #660000, #000000);
        background-size: 400% 400%;
        animation: gradientMove 10s ease infinite;
      }
      @keyframes gradientMove {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }

      /* Card fade-in */
      .card {
        animation: fadeInUp 1s ease;
      }
      @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
      }

      /* Glow Effect on Inputs */
      .form-control:focus {
        border-color: #ff4d4d;
        box-shadow: 0 0 10px rgba(255, 77, 77, 0.9);
        background-color: rgba(255,255,255,0.05);
        color: #fff;
      }

      /* Glow Button */
      .glow-btn {
        background: linear-gradient(90deg, #ff0000, #ff4d4d);
        color: #fff;
        border: none;
        border-radius: 12px;
        transition: 0.3s;
        box-shadow: 0 0 15px rgba(255,0,0,0.6);
      }
      .glow-btn:hover {
        transform: scale(1.05);
        box-shadow: 0 0 25px rgba(255,0,0,0.9);
      }

      /* Light placeholder for dark backgrounds */
      .form-control::placeholder {
        color: #bfbfbf;
        opacity: 1;
      }
    `}
      </style>

      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-7 col-lg-6">
            <div
              className="card shadow-lg border-0 p-4"
              style={{
                borderRadius: "20px",
                background: "rgba(0,0,0,0.65)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                color: "white",
              }}
            >
              <h3 className="text-center mb-4 fw-bold">Create Account</h3>

              {/* Role Dropdown */}
              <div className="mb-3">
                <label className="form-label fw-semibold">Select Role</label>
                <select
                  id="role"
                  className="form-select bg-transparent text-white border-light"
                  style={{ borderRadius: "12px" }}
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option className="text-dark" value="customer">
                    Customer
                  </option>
                  <option className="text-dark" value="staff">
                    Staff
                  </option>
                  <option className="text-dark" value="admin">
                    Admin
                  </option>
                </select>
              </div>

              {/* Show message if admin already exists */}
              {role === "admin" && adminExists && (
                <p className="text-danger text-center mb-3">
                  Admin already registered. You cannot register again.
                </p>
              )}

              <form onSubmit={handleSubmit}>
                {/* Common Fields */}
                <div className="input-group mb-3">
                  <span className="input-group-text bg-transparent text-white border-light">
                    <FaUser />
                  </span>
                  <input
                    type="text"
                    id="name"
                    className="form-control bg-transparent text-white border-light"
                    placeholder="Full Name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="input-group mb-3">
                  <span className="input-group-text bg-transparent text-white border-light">
                    <FaEnvelope />
                  </span>
                  <input
                    type="email"
                    id="email"
                    className="form-control bg-transparent text-white border-light"
                    placeholder="Email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="input-group mb-3">
                  <span className="input-group-text bg-transparent text-white border-light">
                    <FaLock />
                  </span>
                  <input
                    type="password"
                    id="password"
                    className="form-control bg-transparent text-white border-light"
                    placeholder="Password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>

                {/* Customer Fields */}
                {role === "customer" && (
                  <>
                    <div className="input-group mb-3">
                      <span className="input-group-text bg-transparent text-white border-light">
                        <FaPhone />
                      </span>
                      <input
                        type="number"
                        id="number"
                        className="form-control bg-transparent text-white border-light"
                        placeholder="Phone Number"
                        required
                        value={formData.number}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="input-group mb-3">
                      <span className="input-group-text bg-transparent text-white border-light">
                        📅
                      </span>
                      <input
                        type="date"
                        id="dob"
                        className="form-control bg-transparent text-white border-light"
                        required
                        value={formData.dob}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="input-group mb-3">
                      <span className="input-group-text bg-transparent text-white border-light">
                        <FaHome />
                      </span>
                      <input
                        type="text"
                        id="address"
                        className="form-control bg-transparent text-white border-light"
                        placeholder="Address"
                        required
                        value={formData.address}
                        onChange={handleChange}
                      />
                    </div>
                  </>
                )}

                {/* Staff Fields */}
                {role === "staff" && (
                  <>
                    <div className="input-group mb-3">
                      <span className="input-group-text bg-transparent text-white border-light">
                        <FaIdBadge />
                      </span>
                      <input
                        type="text"
                        id="staffId"
                        className="form-control bg-transparent text-white border-light"
                        placeholder="Staff ID"
                        required
                        value={formData.staffId}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="input-group mb-3">
                      <span className="input-group-text bg-transparent text-white border-light">
                        <FaBuilding />
                      </span>
                      <input
                        type="text"
                        id="department"
                        className="form-control bg-transparent text-white border-light"
                        placeholder="Department"
                        value={formData.department}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="input-group mb-3">
                      <span className="input-group-text bg-transparent text-white border-light">
                        <FaBuilding />
                      </span>
                      <input
                        type="text"
                        id="designation"
                        className="form-control bg-transparent text-white border-light"
                        placeholder="Designation"
                        required
                        value={formData.designation}
                        onChange={handleChange}
                      />
                    </div>
                  </>
                )}

                {/* Admin Fields */}
                {role === "admin" && !adminExists && (
                  <>
                    <div className="mb-3">
                      <label className="form-label fw-semibold">
                        Super Access
                      </label>
                      <select
                        id="superAccess"
                        className="form-select bg-transparent text-white border-light"
                        style={{ borderRadius: "12px" }}
                        value={formData.superAccess}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            superAccess: e.target.value === "true",
                          })
                        }
                      >
                        <option className="text-dark" value="false">
                          No
                        </option>
                        <option className="text-dark" value="true">
                          Yes
                        </option>
                      </select>
                    </div>
                    <div className="input-group mb-3">
                      <span className="input-group-text bg-transparent text-white border-light">
                        <FaKey />
                      </span>
                      <input
                        type="text"
                        id="permissions"
                        className="form-control bg-transparent text-white border-light"
                        placeholder="Permissions (comma separated)"
                        value={formData.permissions}
                        onChange={handleChange}
                      />
                    </div>
                  </>
                )}

                {/* Submit Button */}
                <div className="d-grid">
                  <button
                    type="submit"
                    className="glow-btn fw-bold py-2 d-flex align-items-center justify-content-center"
                    disabled={loading || (role === "admin" && adminExists)}
                  >
                    {loading ? (
                      <>
                        <div
                          className="spinner-border text-light me-2"
                          role="status"
                          style={{ width: "1.2rem", height: "1.2rem" }}
                        >
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        Registering...
                      </>
                    ) : (
                      "Register"
                    )}
                  </button>
                </div>

                <p className="mt-3 text-center">
                  Already have an account?{" "}
                  <a href="/login" className="text-warning fw-bold">
                    Login here
                  </a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Register;
