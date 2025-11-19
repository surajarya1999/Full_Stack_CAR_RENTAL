import { Link } from "react-router-dom";
import {
  FaCar,
  FaBook,
  FaEnvelope,
  FaStar,
  FaTachometerAlt,
} from "react-icons/fa";

export default function Sidebar() {
  return (
    <div className="bg-dark text-white vh-100 p-3" style={{ width: "250px" }}>
      <h3 className="mb-4">Admin Panel</h3>
      <ul className="nav flex-column gap-2">
        <li className="nav-item">
          <Link to="/admin/dashboard" className="nav-link text-white">
            <FaTachometerAlt /> Dashboard
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/admin/addcars" className="nav-link text-white">
            <FaCar /> Add Car
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/admin/managebookings" className="nav-link text-white">
            <FaBook /> Manage Bookings
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/admin/managecontacts" className="nav-link text-white">
            Manage Contacts
          </Link>
        </li>

        <li className="nav-item">
          <Link to="/admin/managefeedbacks" className="nav-link text-white">
            <FaStar /> View Feedbacks
          </Link>
        </li>
      </ul>
    </div>
  );
}
