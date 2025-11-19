import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Context/AuthContext";
import API from "../services/api";
import { Spinner, Modal, Button, Form } from "react-bootstrap";
import { FaStar } from "react-icons/fa";

// ⭐ Utility component for showing stars
const StarRating = ({ rating }) => {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
      {[...Array(5)].map((_, index) => (
        <FaStar
          key={index}
          size={18}
          color={index < rating ? "#ffc107" : "#e4e5e9"} // yellow or gray
        />
      ))}
    </div>
  );
};

export default function Feedback() {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]); // ⭐ feedback list state
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [feedback, setFeedback] = useState({ rating: "", comment: "" });

  // Fetch bookings
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

  // Fetch all feedbacks
  const fetchFeedbacks = async () => {
    try {
      const res = await API.get("/feedback"); // yeh backend ka getAllFeedbacks use karega
      setFeedbacks(res.data.data);
    } catch (error) {
      console.error("Failed to fetch feedbacks:", error);
    }
  };

  const handleOpenModal = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFeedback({ rating: "", comment: "" });
  };

  const handleSubmitFeedback = async () => {
    try {
      await API.post("/feedback", {
        bookingId: selectedBooking?._id,
        carId: selectedBooking?.carId?._id || selectedBooking?.carId,
        email: user?.email,
        rating: feedback.rating,
        comment: feedback.comment,
      });

      alert("Feedback submitted successfully!");
      handleCloseModal();
      fetchFeedbacks(); // ⭐ refresh feedback list after submit
    } catch (error) {
      console.error("Failed to submit feedback:", error);
      alert("Something went wrong!");
    }
  };

  useEffect(() => {
    if (user?.email) {
      fetchBookings();
      fetchFeedbacks(); // ⭐ load feedbacks on page load
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
      <h2 className="mb-4 text-center">Give Feedback</h2>
      {bookings.length === 0 ? (
        <p className="text-center">No bookings found.</p>
      ) : (
        <div className="row">
          {bookings.map((booking) => {
            // is booking ka feedback filter karo
            const bookingFeedback = feedbacks.filter(
              (f) => f.bookingId?._id === booking._id
            );

            return (
              <div key={booking._id} className="col-md-6 mb-4">
                <div className="card shadow-sm">
                  <img
                    src={booking.carId.image.url}
                    className="card-img-top"
                    alt={booking.carId?.name}
                    style={{ height: "250px", objectFit: "cover" }}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{booking.carId?.name}</h5>
                    <p>
                      <strong>Status:</strong>{" "}
                      <span className="badge bg-success">{booking.status}</span>
                    </p>

                    {/* Already given feedback show karo */}
                    {bookingFeedback.length > 0 && (
                      <div className="mt-3">
                        <h6>⭐ Your Feedback:</h6>
                        {bookingFeedback.map((fb) => (
                          <div key={fb._id} className="border p-2 rounded mb-2">
                            <div className="flex items-center gap-2">
                              <strong>Rating:</strong>
                              <StarRating rating={fb.rating} />{" "}
                              {/* ⭐ show hoga */}
                            </div>
                            <p>
                              <strong>Comment:</strong> {fb.comment}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Agar feedback nahi diya toh button show karo */}
                    {booking.status === "Approved" &&
                      bookingFeedback.length === 0 && (
                        <Button
                          variant="primary"
                          onClick={() => handleOpenModal(booking)}
                        >
                          Give Feedback
                        </Button>
                      )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Feedback Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Give Feedback</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Rating (1-5)</Form.Label>
              <Form.Control
                type="number"
                min="1"
                max="5"
                value={feedback.rating}
                onChange={(e) =>
                  setFeedback({ ...feedback, rating: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Comment</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={feedback.comment}
                onChange={(e) =>
                  setFeedback({ ...feedback, comment: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="success" onClick={handleSubmitFeedback}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
