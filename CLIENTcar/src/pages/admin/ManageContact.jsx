import React, { useEffect, useState } from "react";
import API from "../../services/api";

function ManageContact() {
  const [contacts, setContacts] = useState([]);
  const [replyMessage, setReplyMessage] = useState({});
  const [activeContact, setActiveContact] = useState(null);

  // ✅ Fetch all contacts
  const fetchContacts = async () => {
    try {
      const res = await API.get("/contacts");
      setContacts(res.data.data);
    } catch (err) {
      console.log("Error fetching contacts:", err);
    }
  };

  useEffect(() => {
    fetchContacts();

    // 🔄 Auto-refresh every 5 sec (sync like Contact page)
    const interval = setInterval(fetchContacts, 5000);
    return () => clearInterval(interval);
  }, []);

  // ✅ Send reply (chat me add)
  const handleReply = async (id) => {
    if (!replyMessage[id] || !replyMessage[id].trim()) return;

    try {
      const res = await API.post(`/contacts/${id}/message`, {
        text: replyMessage[id],
        sender: "admin",
      });

      // UI update with new chat
      setContacts((prev) =>
        prev.map((c) => (c._id === id ? { ...c, chat: res.data.chat } : c))
      );

      setReplyMessage((prev) => ({ ...prev, [id]: "" }));
      setActiveContact(null);
    } catch (err) {
      console.error("Error sending reply:", err);
    }
  };

  return (
    <div className="container py-5">
      <h4 className="mb-4">📩 Contact Submissions</h4>

      <div className="row g-4">
        {Array.isArray(contacts) && contacts.length > 0 ? (
          contacts.map((c) => (
            <div className="col-md-6 col-lg-4" key={c._id}>
              <div className="card shadow-sm h-100">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{c.name}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">{c.email}</h6>
                  <p className="mb-1">
                    <strong>Phone:</strong> {c.phone}
                  </p>
                  <small className="text-muted d-block mb-2">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </small>

                  {/* 🔹 Chat Section */}
                  <div
                    className="border rounded p-2 mb-3"
                    style={{ height: "150px", overflowY: "auto" }}
                  >
                    {c.chat && c.chat.length > 0 ? (
                      c.chat.map((msg, i) => (
                        <div
                          key={i}
                          className={`mb-2 p-2 rounded ${
                            msg.sender === "admin"
                              ? "bg-primary text-white text-end"
                              : "bg-light text-dark text-start border"
                          }`}
                        >
                          <small className="fw-bold d-block">
                            {msg.sender === "admin" ? "Admin" : "User"}
                          </small>
                          {msg.text}
                        </div>
                      ))
                    ) : (
                      <p className="text-muted small">No conversation yet</p>
                    )}
                  </div>

                  {/* 🔹 Reply Section */}
                  {activeContact === c._id ? (
                    <div className="input-group mt-auto">
                      <input
                        type="text"
                        value={replyMessage[c._id] || ""}
                        onChange={(e) =>
                          setReplyMessage({
                            ...replyMessage,
                            [c._id]: e.target.value,
                          })
                        }
                        className="form-control"
                        placeholder="Type reply..."
                      />
                      <button
                        className="btn btn-success"
                        onClick={() => handleReply(c._id)}
                      >
                        Send
                      </button>
                    </div>
                  ) : (
                    <button
                      className="btn btn-outline-primary mt-auto"
                      onClick={() => setActiveContact(c._id)}
                    >
                      Reply
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-muted">No contacts found</p>
        )}
      </div>
    </div>
  );
}

export default ManageContact;
