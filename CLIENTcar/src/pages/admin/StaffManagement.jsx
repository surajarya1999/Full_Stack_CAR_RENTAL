import  { useEffect, useState } from "react";
import API from "../../services/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function StaffManagement() {
  const [staffs, setStaffs] = useState([]);

  // ✅ Fetch all staff
  const fetchStaffs = async () => {
    try {
      const res = await API.get("/display");
      setStaffs(res.data.data || []);
    } catch (error) {
      console.error("Error fetching staff:", error);
      toast.error("Failed to fetch staff list");
    }
  };

  useEffect(() => {
    fetchStaffs();
  }, []);

  // ✅ Approve staff
  const handleApprove = async (id) => {
    try {
      await API.put(`/approve/${id}`);
      toast.success("✅ Staff approved successfully!");
      fetchStaffs();
    } catch (error) {
      toast.error("Error approving staff");
    }
  };

  // ✅ Reject staff
  const handleReject = async (id) => {
    try {
      await API.delete(`/reject/${id}`);
      toast.success("❌ Staff rejected successfully!");
      fetchStaffs();
    } catch (error) {
      toast.error("Error rejecting staff");
    }
  };

  return (
    <div className="container py-5">
      <ToastContainer />
      <h2 className="mb-4 text-center fw-bold">Manage Staff Requests</h2>

      <div className="row">
        {staffs.length > 0 ? (
          staffs.map((staff) => (
            <div key={staff._id} className="col-md-4 mb-4">
              <div className="card shadow-sm h-100 border-0">
                {/* ✅ Card Body */}
                <div className="card-body text-center">
                  <h5 className="card-title mb-2">{staff.name}</h5>
                  <p className="text-muted mb-1">
                    <strong>Email:</strong> {staff.email}
                  </p>
                  <p className="mb-1">
                    <strong>Role:</strong> {staff.role || "N/A"}
                  </p>
                  <p className="mb-2">
                    <strong>Status:</strong>{" "}
                    {staff.isApproved ? (
                      <span className="text-success fw-semibold">Approved</span>
                    ) : (
                      <span className="text-warning fw-semibold">Pending</span>
                    )}
                  </p>
                </div>

                {/* ✅ Footer Buttons */}
                <div className="card-footer bg-light text-center">
                  {!staff.isApproved ? (
                    <>
                      <button
                        onClick={() => handleApprove(staff._id)}
                        className="btn btn-success btn-sm me-2"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(staff._id)}
                        className="btn btn-danger btn-sm"
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <span className="text-success fw-semibold">Approved</span>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-muted">No staff requests found</p>
        )}
      </div>
    </div>
  );
}
