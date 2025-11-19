import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Context/AuthContext";
import API from "../services/api";
import { Spinner } from "react-bootstrap";

export default function MyBookings() {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const res = await API.get(`/userdisplay?email=${user.email}`);
      setBookings(res.data.data);
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.email) {
      fetchBookings();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2 className="mb-4 text-center">My Bookings</h2>
      {bookings.length === 0 ? (
        <p className="text-center">No bookings found.</p>
      ) : (
        <div className="row">
          {bookings.map((booking) => (
            <div key={booking._id} className="col-md-6 mb-4">
              <div className="card shadow-sm">
                <img
                  src={booking.carId.image.url}
                  className="card-img-top"
                  alt={booking.carId?.name}
                  style={{ height: "300px", objectFit: "cover" }}
                />
                <div className="card-body">
                  <h5 className="card-title">{booking.carId?.name}</h5>
                  <p>
                    <strong>Pickup:</strong> {booking.fromdate}
                  </p>
                  <p>
                    <strong>Drop:</strong> {booking.todate}
                  </p>
                  <p>
                    <strong>Location:</strong> {booking.location}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span
                      className={`badge ${
                        booking.status === "Pending"
                          ? "bg-warning text-dark"
                          : booking.status === "Approved"
                          ? "bg-success"
                          : booking.status === "Rejected"
                          ? "bg-danger"
                          : "bg-secondary"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
