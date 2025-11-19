import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import API from "../services/api";
import { AuthContext } from "../Context/AuthContext";
import "bootstrap-icons/font/bootstrap-icons.css";
import { toast } from "react-toastify";

export default function CarDetails() {
  const { user } = useContext(AuthContext);
  const [submitted, setSubmitted] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [testDrive, setTestDrive] = useState(null);
  const [testDriveDate, setTestDriveDate] = useState("");
  const [testDriveTime, setTestDriveTime] = useState("");
  const [testDriveAmPm, setTestDriveAmPm] = useState("AM");
  const [totalAmount, setTotalAmount] = useState(0);

  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    fromdate: "",
    todate: "",
    location: "",
    document: null,
  });

  const [booking, setBooking] = useState(null);
  const [carById, setCarById] = useState(null);
  const [loading, setLoading] = useState(true);

  // Calculate total rent when dates change
  useEffect(() => {
    if (formData.fromdate && formData.todate && carById?.price) {
      const from = new Date(formData.fromdate);
      const to = new Date(formData.todate);

      if (from <= to) {
        const days = Math.ceil((to - from) / (1000 * 60 * 60 * 24)) + 1;
        setTotalAmount(days * Number(carById.price));
      } else {
        setTotalAmount(0);
      }
    }
  }, [formData.fromdate, formData.todate, carById]);

  // Prefill email
  useEffect(() => {
    if (user?.email) setFormData((prev) => ({ ...prev, email: user.email }));
  }, [user]);

  // Fetch car data
  const fetchingCarById = async () => {
    try {
      const res = await API.get(`/carview/${id}`);
      setCarById(res.data.data);
    } catch (error) {
      console.error("carById fetching Err", error);
      toast.error("Failed to load car details");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchingCarById();
  }, [id]);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const uploadToCloudinary = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "car_booking");
    data.append("cloud_name", "djprilnpn");

    const isPdf = file.type === "application/pdf";
    const endpoint = isPdf
      ? "https://api.cloudinary.com/v1_1/djprilnpn/raw/upload"
      : "https://api.cloudinary.com/v1_1/djprilnpn/image/upload";

    const res = await fetch(endpoint, { method: "POST", body: data });
    if (!res.ok) throw new Error("Cloudinary upload failed");

    const result = await res.json();
    return {
      public_id: result.public_id,
      url: result.secure_url || result.url,
    };
  };

  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      toast.warning("⚠️ Please login to book this car");
      return navigate("/Login");
    }
    setShowPopup(true);
  };

  const confirmBooking = async () => {
    if (formData.fromdate && formData.todate) {
      const from = new Date(formData.fromdate);
      const to = new Date(formData.todate);
      if (from > to) {
        toast.warning("From-date cannot be after To-date");
        return;
      }
    }

    setLoading(true);
    try {
      // Upload document
      let documentObj = null;
      if (formData.document)
        documentObj = await uploadToCloudinary(formData.document);

      // Create booking
      const bookingRes = await API.post("/bookinginsert", {
        name: formData.name,
        email: formData.email,
        fromdate: formData.fromdate,
        todate: formData.todate,
        location: formData.location,
        carId: id,
        status: "Pending",
        document: documentObj,
        testDrive: !!testDrive,
        testDriveDate: testDrive ? testDriveDate : null,
        testDriveTime: testDrive ? `${testDriveTime} ${testDriveAmPm}` : null,
      });

      console.log("Booking Response:", bookingRes.data);

      // Backend must return: { success: true, data: { _id: "...", ... } }
      if (!bookingRes.data?.success || !bookingRes.data?.data?._id)
        throw new Error("Booking creation failed, ID not received");

      const bookingData = bookingRes.data.data;
      setBooking(bookingData);
      setSubmitted(true);
      setShowPopup(false);

      // Load Razorpay
      const resScript = await loadRazorpayScript();
      if (!resScript) return toast.error("Razorpay SDK failed to load");

      // Create order
      const orderRes = await API.post("/createOrder", {
        amount: totalAmount * 100, // per day * days
        bookingId: bookingData._id,
      });

      if (!orderRes.data?.order) throw new Error("Order creation failed");

      const { order } = orderRes.data;

      // Razorpay checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_REdlTPcUa6qhPw",
        amount: order.amount,
        currency: order.currency,
        name: carById.name,
        description: "Car Booking Payment",
        order_id: order.id,
        handler: async (response) => {
          try {
            const verifyRes = await API.post("/verifyPayment", {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              bookingId: bookingData._id,
              amount: order.amount, // 👈 paise backend ko bhejenge
              paymentMethod: "Razorpay", // 👈 fixed since Razorpay hai
            });

            if (verifyRes.data.success) {
              toast.success("✅ Payment Successful");

              // frontend state me update kar dete hai
              setBooking((prev) => ({
                ...prev,
                isPaid: true,
                transactionId: response.razorpay_payment_id,
                amountPaid: order.amount / 100,
                paymentDate: new Date(),
                paymentMethod: "Razorpay",
              }));
            } else {
              toast.error("❌ Payment verification failed");
            }
          } catch (err) {
            console.error("Verify error:", err);
            toast.error("❌ Payment verification failed");
          }
        },

        prefill: { name: formData.name, email: formData.email },
        theme: { color: "#3399cc" },
      };

      new window.Razorpay(options).open();
    } catch (err) {
      console.error("Booking + Payment error:", err);
      toast.error(err?.message || "Failed to book car!");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !submitted)
    return <div className="text-center mt-5">Loading...</div>;

  return (
    <>
      {/* Car Details */}
      <div className="container py-5">
        <div className="row align-items-center">
          <div className="col-md-6">
            <img
              src={carById?.image?.url}
              alt={carById?.name}
              className="img-fluid rounded-4 shadow"
            />
          </div>
          <div className="col-md-6">
            <h2 className="fw-bold text-primary">{carById?.name}</h2>
            <p className="text-muted mb-2">{carById?.description}</p>
            <p className="fs-5 fw-semibold text-success">
              Price: ₹{carById?.price}/day
            </p>
          </div>
        </div>
      </div>

      {/* Booking Form */}
      <div className="bg-light py-5">
        <div className="container">
          <h3 className="text-center text-danger fw-bold mb-4">
            Book This Car
          </h3>
          {submitted ? (
            <div className="alert alert-success text-center">
              <p>Thank you! Your booking request has been received.</p>
              <p className="mt-2">
                <strong>Status:</strong>{" "}
                <span
                  className={`${
                    booking?.status === "Pending"
                      ? "text-warning fw-bold"
                      : booking?.status === "Approved"
                      ? "text-success fw-bold"
                      : "text-danger fw-bold"
                  }`}
                >
                  {booking?.status || "Pending"}
                </span>
              </p>
            </div>
          ) : (
            <form className="row g-4" onSubmit={handleSubmit}>
              <div className="col-md-6">
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <input
                  type="text"
                  className="form-control"
                  name="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <input
                  type="date"
                  className="form-control"
                  name="fromdate"
                  value={formData.fromdate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <input
                  type="date"
                  className="form-control"
                  name="todate"
                  value={formData.todate}
                  min={
                    formData.fromdate || new Date().toISOString().split("T")[0]
                  }
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <input
                  type="text"
                  className="form-control"
                  name="location"
                  placeholder="Pickup Location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Upload Driving License</label>
                <input
                  type="file"
                  className="form-control"
                  accept="image/*" // ✅ ab sirf images allow hongi (jpg, png, jpeg, webp etc.)
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      document: e.target.files?.[0] || null,
                    }))
                  }
                />
                <small className="text-muted">
                  Only image formats (JPG, PNG, JPEG, WEBP) allowed.
                </small>
              </div>

              <div className="col-12 text-center">
                {totalAmount > 0 && (
                  <p className="fw-bold fs-5 text-primary mb-3">
                    Total Rent: ₹{totalAmount.toLocaleString("en-IN")}
                  </p>
                )}
                <button
                  type="submit"
                  className="btn btn-success px-5 py-2 rounded-pill"
                  disabled={loading}
                >
                  {loading ? "Booking..." : "Submit Booking"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Popup Modal */}
      {showPopup && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50">
          <div
            className="bg-white p-4 rounded shadow-lg"
            style={{ width: "400px" }}
          >
            <h5 className="mb-3">Do you want a Test Drive?</h5>
            <div className="d-flex gap-3 mb-3">
              <button
                onClick={() => setTestDrive(true)}
                className={`btn ${
                  testDrive ? "btn-success" : "btn-outline-success"
                }`}
              >
                Yes
              </button>
              <button
                onClick={() => setTestDrive(false)}
                className={`btn ${
                  testDrive === false ? "btn-danger" : "btn-outline-danger"
                }`}
              >
                No
              </button>
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold text-primary">
                Select Date
              </label>
              <div className="input-group">
                <span className="input-group-text bg-primary text-white">
                  <i className="bi bi-calendar-date"></i>
                </span>
                <input
                  type="date"
                  className="form-control border-primary shadow-sm"
                  value={testDriveDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setTestDriveDate(e.target.value)}
                />
              </div>
              <div className="form-text text-muted">
                Please choose your preferred test drive date
              </div>
            </div>
            <div className="mb-3 d-flex gap-2">
              <input
                type="time"
                className="form-control"
                value={testDriveTime}
                onChange={(e) => setTestDriveTime(e.target.value)}
              />
              <select
                className="form-select"
                value={testDriveAmPm}
                onChange={(e) => setTestDriveAmPm(e.target.value)}
              >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>
            <div className="d-flex justify-content-end gap-2">
              <button
                className="btn btn-secondary"
                onClick={() => setShowPopup(false)}
              >
                Cancel
              </button>
              <button className="btn btn-primary" onClick={confirmBooking}>
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
