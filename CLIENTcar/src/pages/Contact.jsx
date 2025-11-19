import React, { useState, useEffect } from "react";
import API from "../services/api";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [chat, setChat] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [contactId, setContactId] = useState(null);

  // ✅ input handle
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ user details submit (ek hi baar)
  // Load contactId from localStorage if available
  useEffect(() => {
    const savedId = localStorage.getItem(`contactId_${formData.email}`);
    if (savedId) {
      setContactId(savedId);
      setSubmitted(true);
    }
  }, [formData.email]);

  // After submit, save contactId in localStorage
  const handleSubmitDetails = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/contacts", formData);
      if (res.data && res.data.data) {
        alert("Message sent successfully!");
        setSubmitted(true);
        setContactId(res.data.data._id);
        localStorage.setItem(`contactId_${formData.email}`, res.data.data._id);
        setFormData({ ...formData, message: "" });
      }
    } catch (err) {
      console.error("Error submitting details:", err);
      alert("Error while sending message.");
    }
  };

  // ✅ chat message bhejna (multiple times)
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!formData.message.trim() || !contactId) return;

    try {
      const res = await API.post(`/contacts/${contactId}/message`, {
        text: formData.message,
        sender: "user",
      });

      // backend se naya chat array return milega
      setChat(res.data.chat);
      setFormData({ ...formData, message: "" });
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  // ✅ admin ke reply sync karne ke liye (auto refresh)
  // ✅ Auto refresh chat har 5 sec
  useEffect(() => {
    if (contactId) {
      const interval = setInterval(async () => {
        try {
          const res = await API.get(`/contacts/${contactId}`);
          if (res.data && res.data.chat) {
            setChat(res.data.chat);
          }
        } catch (err) {
          console.error("Error refreshing chat:", err);
        }
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [contactId]);

  return (
    <main className="flex-grow-1 mb-4">
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row align-items-center g-5">
            {/* Left Info */}
            <div className="col-lg-6">
              <img
                src="/undraw_remote-worker_0l91.png"
                alt="Contact"
                className="img-fluid h-auto rounded-4 shadow"
              />
              <div className="mt-4">
                <h4 className="text-black fw-bold">Need Assistance?</h4>
                <p className="text-muted">
                  Our team is available 24/7 to assist with your car rental
                  queries. Drop us a message and we’ll get back to you shortly.
                </p>
              </div>
            </div>

            {/* Chatbox */}
            <div className="col-lg-6">
              <div className="bg-white rounded-4 shadow p-4">
                <h3 className="fw-bold text-center mb-4">Live Chat</h3>

                {/* Messages */}
                <div
                  className="border rounded p-3 mb-3"
                  style={{ height: "250px", overflowY: "auto" }}
                >
                  {chat.length > 0 ? (
                    chat.map((msg, i) => (
                      <div
                        key={i}
                        className={`mb-2 p-2 rounded ${
                          msg.sender === "user"
                            ? "bg-success text-white text-end"
                            : "bg-light text-dark text-start border"
                        }`}
                      >
                        <small className="d-block fw-bold">
                          {msg.sender === "user" ? "You" : "Admin"}
                        </small>
                        {msg.text}
                      </div>
                    ))
                  ) : (
                    <p className="text-muted text-center">
                      No messages yet. Start the conversation!
                    </p>
                  )}
                </div>

                {/* 1️⃣ User Details Form (only once) */}
                {!submitted && (
                  <form onSubmit={handleSubmitDetails} className="mb-3">
                    <input
                      type="text"
                      name="name"
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={handleChange}
                      className="form-control mb-2"
                      required
                    />
                    <input
                      type="email"
                      name="email"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={handleChange}
                      className="form-control mb-2"
                      required
                    />
                    <input
                      type="text"
                      name="phone"
                      placeholder="Your Number"
                      value={formData.phone}
                      onChange={handleChange}
                      className="form-control mb-2"
                      required
                    />
                    <input
                      type="text"
                      name="message"
                      placeholder="Initial message..."
                      value={formData.message}
                      onChange={handleChange}
                      className="form-control mb-2"
                      required
                    />
                    <button type="submit" className="btn btn-primary w-100">
                      Submit
                    </button>
                  </form>
                )}

                {/* 2️⃣ Chat Send (after submit) */}
                {submitted && (
                  <form onSubmit={handleSendMessage}>
                    <div className="input-group">
                      <input
                        type="text"
                        name="message"
                        placeholder="Type your message..."
                        value={formData.message}
                        onChange={handleChange}
                        className="form-control"
                        required
                      />
                      <button type="submit" className="btn btn-success">
                        Send
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
