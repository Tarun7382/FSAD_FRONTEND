import React, { useEffect, useState } from "react";

const getStatusColor = (status) => {
  switch (status) {
    case "Pending":     return "#f59e0b";
    case "In Progress": return "#3b82f6";
    case "Resolved":    return "#10b981";
    case "Rejected":    return "#ef4444";
    case "Urgent":      return "#dc2626";
    default:            return "#6b7280";
  }
};

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  marginTop: "8px",
  marginBottom: "16px",
  borderRadius: "12px",
  border: "1px solid #cbd5e1",
  background: "#ffffff",
  color: "#1e293b",
  fontSize: "15px",
  outline: "none",
  boxSizing: "border-box",
};

const labelStyle = {
  display: "block",
  marginTop: "10px",
  fontWeight: "500",
  color: "#1e293b",
};

const BASE = "/api";

export default function CitizenSection({ username }) {
  const [reports,    setReports]    = useState([]);
  const [text,       setText]       = useState("");
  const [category,   setCategory]   = useState("");
  const [priority,   setPriority]   = useState("Medium");
  const [wardNumber, setWardNumber] = useState("");
  const [image,      setImage]      = useState("");
  const [landmark,   setLandmark]   = useState("");
  const [error,      setError]      = useState("");
  const [submitted,  setSubmitted]  = useState(false);
  const [loading,    setLoading]    = useState(false);

  // ✅ Resolve username from prop first, then localStorage
  const resolvedUsername =
    username ||
    localStorage.getItem("username") ||
    JSON.parse(localStorage.getItem("currentUser") || "{}")?.username;

  const region = localStorage.getItem("region") || "ALL";
  const role   = localStorage.getItem("role")   || "";

  // ✅ FIXED — depends on resolvedUsername string, not object
  useEffect(() => {
    if (!resolvedUsername) {
      console.warn("No username — skipping report fetch");
      return;
    }

    console.log("Fetching reports for:", resolvedUsername);

    fetch(`${BASE}/reports/my/${resolvedUsername}`)
      .then((res) => {
        console.log("Fetch status:", res.status);
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then((data) => {
        console.log("Reports loaded:", data.length);
        setReports(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setReports([]);
      });
  }, [resolvedUsername]); // ✅ string dependency — works correctly

  if (!resolvedUsername) {
    return (
      <p style={{ color: "red", padding: 20 }}>
        ⚠ No logged-in user found. Please log in again.
      </p>
    );
  }

  // ── Image Upload ─────────────────────────────────────────────
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

  // ── Submit Report ────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!text.trim() || !category || !wardNumber) {
      setError("⚠ Please fill all required fields.");
      return;
    }

    setLoading(true);
    setError("");

    const reportData = {
      ticketId:  "CC-" + Date.now(),
      text,
      category,
      priority,
      wardNumber,
      landmark,
      image,
      region,
      status:    priority === "High" ? "Urgent" : "Pending",
      verified:  false,
      createdBy: resolvedUsername,   // ✅ always correct
      feedback:  0,
    };

    try {
      const res = await fetch(`${BASE}/reports/submit`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(reportData),
      });

      const data = await res.json();

      if (res.ok) {
        setReports((prev) => [...prev, data]);
        setText("");
        setCategory("");
        setPriority("Medium");
        setLandmark("");
        setWardNumber("");
        setImage("");
        setError("");
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
      } else {
        setError(data?.message || "Failed to submit report.");
      }
    } catch (err) {
      console.error("Submit error:", err);
      setError("Cannot connect to server.");
    } finally {
      setLoading(false);
    }
  };

  // ── Star Rating ──────────────────────────────────────────────
  const handleFeedback = async (reportId, star) => {
    try {
      await fetch(`${BASE}/reports/feedback/${reportId}`, {
        method:  "PUT",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ feedback: star }),
      });
      setReports((prev) =>
        prev.map((r) => (r.id === reportId ? { ...r, feedback: star } : r))
      );
    } catch (err) {
      console.error("Feedback error:", err);
    }
  };

  // ── Render ───────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "#f1f5f9",
                  padding: "24px", fontFamily: "Arial, sans-serif" }}>
      <div style={{ width: "100%" }}>

        {/* ── Header ── */}
        <div style={cardStyle}>
          <h2 style={{ margin: 0, fontSize: "32px", color: "#1e293b" }}>
            Citizen Dashboard —{" "}
            <span style={{ color: "#f59e0b" }}>{resolvedUsername}</span>
          </h2>
          <p style={{ color: "#64748b", marginTop: 8 }}>
            Report civic issues and track status updates easily.
          </p>
        </div>

        {/* ── Report Form ── */}
        <div style={cardStyle}>
          <h3 style={{ marginBottom: 20 }}>📋 Report an Issue</h3>

          {submitted && <div style={successBox}>✅ Report submitted successfully!</div>}
          {error     && <div style={errorBox}>{error}</div>}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label style={labelStyle}>Issue Category *</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} style={inputStyle}>
                <option value="">Select Category</option>
                <option value="Roads">Roads</option>
                <option value="Water">Water</option>
                <option value="Electricity">Electricity</option>
                <option value="Sanitation">Sanitation</option>
                <option value="Public Safety">Public Safety</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Ward Number *</label>
              <select value={wardNumber} onChange={(e) => setWardNumber(e.target.value)} style={inputStyle}>
                <option value="">Select Ward</option>
                <option value="Ward 1">Ward 1</option>
                <option value="Ward 2">Ward 2</option>
                <option value="Ward 3">Ward 3</option>
                <option value="Ward 4">Ward 4</option>
                <option value="Ward 5">Ward 5</option>
              </select>
            </div>
          </div>

          <label style={labelStyle}>Street / Landmark</label>
          <input type="text" value={landmark}
            onChange={(e) => setLandmark(e.target.value)}
            placeholder="Eg: Near KLU Main Gate" style={inputStyle} />

          <label style={labelStyle}>Upload Issue Image</label>
          <input type="file" accept="image/*"
            onChange={handleImageUpload} style={inputStyle} />
          {image && (
            <img src={image} alt="Preview"
              style={{ width: 220, marginTop: 12, borderRadius: 12,
                       boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }} />
          )}

          <label style={labelStyle}>Priority</label>
          <select value={priority} onChange={(e) => setPriority(e.target.value)} style={inputStyle}>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>

          <label style={labelStyle}>Description *</label>
          <textarea value={text} onChange={(e) => setText(e.target.value)}
            placeholder="Describe your issue..." rows={4}
            style={{ ...inputStyle, resize: "vertical" }} />

          <button onClick={handleSubmit} disabled={loading}
            style={{
              width: "100%", marginTop: 16,
              background: loading ? "#94a3b8" : "#0ea5e9",
              color: "#fff", border: "none", padding: "14px",
              borderRadius: "12px", fontSize: "16px",
              fontWeight: "bold",
              cursor: loading ? "not-allowed" : "pointer",
            }}>
            {loading ? "Submitting..." : "Submit Report"}
          </button>
        </div>

        {/* ── My Reports ── */}
        <div style={cardStyle}>
          <h3>📁 Your Reports ({reports.length})</h3>

          {reports.length > 0 ? (
            reports.map((r) => (
              <div key={r.id} style={reportCard}>
                <div style={{ display: "grid",
                              gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  <p><b>🎫 Ticket:</b> {r.ticketId}</p>
                  <p><b>📂 Category:</b> {r.category}</p>
                  <p><b>🏘 Ward:</b> {r.wardNumber}</p>
                  {r.landmark && <p><b>📍 Landmark:</b> {r.landmark}</p>}
                  <p>
                    <b>⚡ Priority:</b>{" "}
                    <span style={{
                      color: r.priority === "High" ? "#ef4444"
                           : r.priority === "Medium" ? "#f59e0b" : "#10b981",
                      fontWeight: "bold",
                    }}>{r.priority}</span>
                  </p>
                  <p>
                    <b>📌 Status:</b>{" "}
                    <span style={{ color: getStatusColor(r.status),
                                   fontWeight: "bold" }}>{r.status}</span>
                    {!r.verified && (
                      <span style={{ color: "#94a3b8", fontSize: 13 }}>
                        {" "}(Awaiting verification)
                      </span>
                    )}
                  </p>
                </div>

                <p><b>📝 Description:</b> {r.text}</p>

                {r.image && (
                  <img src={r.image} alt="Report"
                    style={{ width: 160, borderRadius: 10, marginTop: 8 }} />
                )}

                <small style={{ color: "#94a3b8" }}>
                  🕒 {r.createdAt
                        ? new Date(r.createdAt).toLocaleString()
                        : r.date || ""}
                </small>

                {r.status === "Resolved" && (
                  <div style={{ marginTop: 10 }}>
                    <b>⭐ Rate Resolution:</b>{" "}
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star}
                        onClick={() => handleFeedback(r.id, star)}
                        style={{
                          cursor: "pointer", fontSize: 24,
                          color: r.feedback >= star ? "#f59e0b" : "#cbd5e1",
                          marginRight: 4,
                        }}>★</span>
                    ))}
                    {r.feedback > 0 && (
                      <span style={{ color: "#94a3b8", fontSize: 13 }}>
                        {r.feedback}/5
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p style={{ color: "#94a3b8" }}>No reports submitted yet.</p>
          )}
        </div>

      </div>
    </div>
  );
}

// ── Shared Styles ─────────────────────────────────────────────
const cardStyle = {
  background: "#ffffff", borderRadius: "20px",
  padding: "28px", boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
  marginBottom: "24px",
};
const reportCard = {
  marginTop: 16, border: "1px solid #e2e8f0",
  borderRadius: "16px", padding: "18px", background: "#f8fafc",
};
const successBox = {
  background: "#10b981", color: "#fff",
  padding: "12px 16px", borderRadius: 10,
  marginBottom: 16, fontWeight: 500,
};
const errorBox = {
  background: "#fef2f2", color: "#ef4444",
  border: "1px solid #fecaca", padding: "12px 16px",
  borderRadius: 10, marginBottom: 16,
};