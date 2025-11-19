import React, { useEffect, useState } from "react";
import API from "../../services/api";
import { FaStar } from "react-icons/fa";

// ⭐ Utility component for showing stars
const StarRating = ({ rating }) => {
  return (
    <div className="d-flex gap-1">
      {[...Array(5)].map((_, index) => (
        <FaStar
          key={index}
          size={18}
          color={index < rating ? "#ffc107" : "#e4e5e9"}
        />
      ))}
    </div>
  );
};

export default function ManageFeedbacks() {
  const [feedbacks, setFeedbacks] = useState([]);

  // ✅ Fetch all feedbacks
  const fetchFeedbacks = async () => {
    try {
      const res = await API.get("/feedback"); // backend se sab feedbacks
      setFeedbacks(res.data.data);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  return (
    <div className="container py-5">
      <h2 className="mb-4 text-center">User Feedbacks</h2>

      <div className="row">
        {feedbacks.length > 0 ? (
          feedbacks.map((fb) => (
            <div key={fb._id} className="col-md-4 mb-4">
              <div className="card shadow-sm h-100">
                {/* ✅ Car Image */}
                {fb.carId?.image?.url && (
                  <img
                    src={fb.carId.image.url}
                    className="card-img-top"
                    alt={fb.carId?.name}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                )}

                {/* ✅ Card Body */}
                <div className="card-body">
                  <h5 className="card-title">
                    {fb.carId?.name || "Unknown Car"}
                  </h5>
                  <p className="text-muted mb-1">
                    <strong>User:</strong> {fb.email}
                  </p>
                  <div className="mb-2">
                    <strong>Rating: </strong>
                    <StarRating rating={fb.rating} />
                  </div>
                  <p className="card-text">
                    <strong>Comment:</strong> {fb.comment || "No comment"}
                  </p>
                </div>

                {/* ✅ Footer with Booking ID */}
                <div className="card-footer bg-light text-muted">
                  Booking ID: <code>{fb.bookingId?._id || fb.bookingId}</code>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-muted">No feedbacks found</p>
        )}
      </div>
    </div>
  );
}
