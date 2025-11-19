import React, { useEffect, useState } from "react";
import API from "../../services/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ManageBookings() {
  const [bookings, setBookings] = useState([]);

  // ✅ Fetch bookings
  const fetchBookings = async () => {
    try {
      const res = await API.get("/bookingdisplay");
      setBookings(res.data.data);
    } catch (err) {
      console.log("Error fetching bookings:", err);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // ✅ Approve Booking
  const handleApprove = async (id) => {
    try {
      await API.put(`/bookings/${id}/approve`);
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: "Approved" } : b))
      );
      toast.success("Booking Approved!");
    } catch (err) {
      console.error(err);
      toast.error("Error Approving Booking");
    }
  };

  // ✅ Reject Booking
  const handleReject = async (id) => {
    try {
      await API.put(`/bookings/${id}/reject`);
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: "Rejected" } : b))
      );
      toast.success("Booking Rejected!");
    } catch (err) {
      console.error(err);
      toast.error("Error Rejecting Booking");
    }
  };

  // ✅ Delete Booking
  const handleDelete = async (id) => {
    try {
      await API.delete(`/bookings/${id}/delete`);
      setBookings((prev) => prev.filter((b) => b._id !== id));
      toast.success("Booking Deleted!");
    } catch (err) {
      console.error(err);
      toast.error("Error Deleting Booking");
    }
  };

  return (
    <div className="container py-5">
      <ToastContainer position="top-center" />
      <h2 className="mb-4">Manage Bookings</h2>

      <table className="table table-bordered table-striped table-hover">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>From</th>
            <th>TO</th>
            <th>Location</th>
            <th>Test Drive</th>
            <th>Test Drive Date</th>
            <th>Test Drive Time</th>
            <th>Status</th>
            <th>Payment</th> {/* ✅ New column */}
            <th>Document</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {Array.isArray(bookings) && bookings.length > 0 ? (
            bookings.map((booking, index) => (
              <tr key={booking._id}>
                <td>{index + 1}</td>
                <td>{booking.name}</td>
                <td>{booking.email}</td>
                <td>{booking.fromdate}</td>
                <td>{booking.todate}</td>
                <td>{booking.location}</td>

                <td>
                  {booking.testDrive ? (
                    <span className="badge bg-success">Yes</span>
                  ) : (
                    <span className="badge bg-danger">No</span>
                  )}
                </td>

                <td>
                  {booking.testDriveDate
                    ? new Date(booking.testDriveDate).toLocaleDateString(
                        "en-IN",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }
                      )
                    : "—"}
                </td>

                <td>
                  {booking.testDriveTime
                    ? booking.testDriveTime // directly show
                    : "—"}
                </td>

                <td>{booking.status || "Pending"}</td>

                {/* ✅ Payment column */}
                <td>
                  {booking.isPaid ? (
                    <div>
                      <span className="badge bg-success">Paid</span>
                      <br />
                      <small>
                        ₹{booking.amountPaid || 0} /{" "}
                        {booking.transactionId?.slice(-6) || "Txn"}
                      </small>
                      <br />
                      <small>
                        {booking.paymentMethod || "—"} |{" "}
                        {booking.paymentDate
                          ? new Date(booking.paymentDate).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }
                            )
                          : ""}
                      </small>
                    </div>
                  ) : (
                    <span className="badge bg-warning text-dark">Unpaid</span>
                  )}
                </td>

                <td className="px-4 py-2">
                  {booking.document && booking.document.url ? (
                    <>
                      {booking.document.resource_type === "image" ? (
                        <img
                          src={booking.document.url}
                          alt="document"
                          className="w-20 h-20 object-cover border rounded"
                        />
                      ) : booking.document.format === "pdf" ? (
                        <a
                          href={booking.document.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 underline"
                        >
                          View PDF
                        </a>
                      ) : (
                        <a
                          href={booking.document.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 underline"
                        >
                          Download File
                        </a>
                      )}
                    </>
                  ) : (
                    <span className="text-gray-400">No Document</span>
                  )}
                </td>

                <td>
                  {booking.status === "Pending" && (
                    <>
                      <button
                        className="btn btn-success btn-sm me-2"
                        onClick={() => handleApprove(booking._id)}
                      >
                        Approve
                      </button>
                      <button
                        className="btn btn-danger btn-sm me-2"
                        onClick={() => handleReject(booking._id)}
                      >
                        Reject
                      </button>
                      <button
                        className="btn btn-warning btn-sm"
                        onClick={() => handleDelete(booking._id)}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="13" className="text-center text-muted">
                No bookings found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ManageBookings;
