import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-toastify";
import { AuthContext } from "../Context/AuthContext";
import { FaEnvelope, FaLock, FaIdBadge } from "react-icons/fa";

const Login = () => {
  const [role, setRole] = useState("customer");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    staffId: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let endpoint = "/login";
      let payload = {};

      if (role === "staff") {
        endpoint = "/staff/login";
        payload = { staffId: formData.staffId, password: formData.password };
      } else if (role === "admin") {
        endpoint = "/admin/login";
        payload = { email: formData.email, password: formData.password };
      } else {
        payload = { email: formData.email, password: formData.password };
      }

      const res = await API.post(endpoint, payload, { withCredentials: true });

      const userData = {
        staffId: res.data.staffId,
        name: res.data.name,
        email: res.data.email,
        role: res.data.role,
        isAuthenticated: true,
      };

      setUser(userData);
      toast.success("Login successful ✅");

      if (res.data.role === "admin") {
        navigate("/admin/admindashboard");
      } else if (res.data.role === "staff") {
        navigate("/admin/AdminDashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
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
          /* Background Animation */
          .animated-bg {
            background: linear-gradient(-45deg, #ff0000, #1a1a1a, #660000, #000000);
            background-size: 400% 400%;
            animation: gradientMove 10s ease infinite;
          }
          @keyframes gradientMove {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }

          /* Card Animation */
          .card {
            animation: fadeInUp 1s ease;
          }
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }

          /* Glow Inputs */
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

          /* Light placeholder */
          .form-control::placeholder {
            color: #bfbfbf;
            opacity: 1;
          }
        `}
      </style>

      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
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
              <h3 className="text-center mb-4 fw-bold">Login</h3>

              {/* Role Dropdown */}
              <div className="mb-3">
                <label className="form-label fw-semibold">Select Role</label>
                <select
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

              <form onSubmit={handleSubmit}>
                {/* Customer/Admin Email */}
                {(role === "customer" || role === "admin") && (
                  <div className="input-group mb-3">
                    <span className="input-group-text bg-transparent text-white border-light">
                      <FaEnvelope />
                    </span>
                    <input
                      type="email"
                      name="email"
                      className="form-control bg-transparent text-white border-light"
                      placeholder="Enter Email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                )}

                {/* Staff ID */}
                {role === "staff" && (
                  <div className="input-group mb-3">
                    <span className="input-group-text bg-transparent text-white border-light">
                      <FaIdBadge />
                    </span>
                    <input
                      type="text"
                      id="staffId"
                      name="staffId" 
                      className="form-control bg-transparent text-white border-light"
                      placeholder="Staff ID"
                      required
                      value={formData.staffId}
                      onChange={handleChange}
                    />
                  </div>
                )}

                {/* Password */}
                <div className="input-group mb-3">
                  <span className="input-group-text bg-transparent text-white border-light">
                    <FaLock />
                  </span>
                  <input
                    type="password"
                    name="password"
                    className="form-control bg-transparent text-white border-light"
                    placeholder="Enter Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Submit Button */}
                <div className="d-grid">
                  <button
                    type="submit"
                    className="glow-btn fw-bold py-2 d-flex align-items-center justify-content-center"
                    disabled={loading}
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
                        Logging in...
                      </>
                    ) : (
                      "Login"
                    )}
                  </button>
                </div>

                <p className="mt-3 text-center">
                  Don’t have an account?{" "}
                  <Link to="/register" className="text-warning fw-bold">
                    Register here
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
