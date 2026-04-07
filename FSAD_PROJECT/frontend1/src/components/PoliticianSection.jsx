import React, { useEffect, useState } from "react";

const BASE = "http://localhost:8080/api";

const STATUS_COLORS = {
  Verified: { bg: "#ecfeff", color: "#0891b2", border: "#a5f3fc" },
  Accepted: { bg: "#ecfdf5", color: "#16a34a", border: "#bbf7d0" },
  Pending: { bg: "#fff7ed", color: "#ea580c", border: "#fed7aa" },
  Rejected: { bg: "#fef2f2", color: "#dc2626", border: "#fecaca" },
  Urgent: { bg: "#fff1f2", color: "#be123c", border: "#fecdd3" },
};

const CATEGORY_ICONS = {
  Roads: "🛣️",
  Water: "💧",
  Electricity: "⚡",
  Sanitation: "🗑️",
  "Public Safety": "🛡️",
};

export default function PoliticianSection({ username }) {
  const [reports, setReports] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [wardFilter, setWardFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [catFilter, setCatFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  const region = localStorage.getItem("region") || "ALL";

  useEffect(() => {
    fetch(`${BASE}/reports/all`)
      .then((r) => r.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        setReports(list);
        setFiltered(list);
      })
      .catch(() => {
        setReports([]);
        setFiltered([]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = [...reports];

    if (region !== "ALL") {
      result = result.filter((r) => r.region === region);
    }

    if (wardFilter !== "All") {
      result = result.filter((r) => r.wardNumber === wardFilter);
    }

    if (statusFilter !== "All") {
      result = result.filter((r) => r.status === statusFilter);
    }

    if (catFilter !== "All") {
      result = result.filter((r) => r.category === catFilter);
    }

    setFiltered(result);
  }, [reports, wardFilter, statusFilter, catFilter, region]);

  const updateStatus = async (id, newStatus) => {
    setUpdating(id);

    try {
      await fetch(`${BASE}/reports/update/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      setReports((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, status: newStatus } : r
        )
      );
    } catch (error) {
      console.error("Update failed", error);
    } finally {
      setUpdating(null);
    }
  };

  const stats = {
    total: reports.length,
    verified: reports.filter((r) => r.status === "Verified").length,
    accepted: reports.filter((r) => r.status === "Accepted").length,
    pending: reports.filter((r) => r.status === "Pending").length,
    urgent: reports.filter((r) => r.status === "Urgent").length,
    rejected: reports.filter((r) => r.status === "Rejected").length,
  };

  const statCards = [
    { label: "Total", value: stats.total, icon: "📋", color: "#6366f1" },
    { label: "Verified", value: stats.verified, icon: "✔️", color: "#0891b2" },
    { label: "Accepted", value: stats.accepted, icon: "✅", color: "#16a34a" },
    { label: "Urgent", value: stats.urgent, icon: "🚨", color: "#be123c" },
    { label: "Pending", value: stats.pending, icon: "⏳", color: "#ea580c" },
    { label: "Rejected", value: stats.rejected, icon: "❌", color: "#dc2626" },
  ];

  const wards = ["All", "Ward 1", "Ward 2", "Ward 3", "Ward 4", "Ward 5"];
  const statuses = [
    "All",
    "Verified",
    "Accepted",
    "Pending",
    "Urgent",
    "Rejected",
  ];
  const categories = [
    "All",
    "Roads",
    "Water",
    "Electricity",
    "Sanitation",
    "Public Safety",
  ];

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "60vh",
          fontSize: 18,
          color: "#64748b",
        }}
      >
        ⏳ Loading reports...
      </div>
    );
  }

  return (
    <div
      style={{
        background: "#f1f5f9",
        minHeight: "100vh",
        padding: "24px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg,#1e293b,#334155)",
          borderRadius: 20,
          padding: "28px 32px",
          marginBottom: 24,
          color: "#fff",
        }}
      >
        <h2 style={{ margin: 0, fontSize: 28, fontWeight: 700 }}>
          🏛️ Politician Dashboard
        </h2>
        <p style={{ marginTop: 8, color: "#cbd5e1" }}>
          Welcome back <b>{username}</b> • Region <b>{region}</b>
        </p>
      </div>

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(6,1fr)",
          gap: 16,
          marginBottom: 24,
        }}
      >
        {statCards.map((s) => (
          <div
            key={s.label}
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: 20,
              textAlign: "center",
              borderTop: `4px solid ${s.color}`,
            }}
          >
            <div style={{ fontSize: 28 }}>{s.icon}</div>
            <div style={{ fontSize: 30, fontWeight: 800, color: s.color }}>
              {s.value}
            </div>
            <div style={{ fontSize: 13, color: "#64748b" }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          padding: 20,
          marginBottom: 20,
          display: "flex",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <select value={wardFilter} onChange={(e) => setWardFilter(e.target.value)}>
          {wards.map((w) => <option key={w}>{w}</option>)}
        </select>

        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          {statuses.map((s) => <option key={s}>{s}</option>)}
        </select>

        <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)}>
          {categories.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>

      {/* Reports */}
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          maxHeight: "65vh",
          overflowY: "auto",
          padding: 20,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(340px,1fr))",
            gap: 18,
          }}
        >
          {[...filtered].reverse().map((r) => {
            const statusStyle =
              STATUS_COLORS[r.status] || STATUS_COLORS.Pending;

            return (
              <div
                key={r.id}
                style={{
                  border: `1px solid ${statusStyle.border}`,
                  borderRadius: 16,
                  padding: 18,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 12,
                  }}
                >
                  <div>
                    <h3 style={{ margin: 0 }}>
                      {CATEGORY_ICONS[r.category] || "📌"} {r.title}
                    </h3>
                    <p style={{ fontSize: 13, color: "#64748b" }}>
                      🎫 {r.ticketId} • 📍 {r.wardNumber}
                    </p>
                  </div>

                  <span
                    style={{
                      background: statusStyle.bg,
                      color: statusStyle.color,
                      padding: "6px 12px",
                      borderRadius: 999,
                      fontSize: 12,
                    }}
                  >
                    {r.status}
                  </span>
                </div>

                <p>{r.text}</p>

{r.image && (
  <img
    src={r.image}
    alt="Citizen complaint"
    style={{
      width: "100%",
      height: "180px",
      objectFit: "cover",
      borderRadius: "12px",
      marginTop: "12px",
      marginBottom: "12px",
      border: "1px solid #e2e8f0",
    }}
  />
)}
              {!["Rejected", "Accepted", "Resolved"].includes(
  String(r.status).trim()
) && (
                  <div style={{ display: "flex", gap: 10 }}>
                    <button
                      disabled={updating === r.id}
                      onClick={() => updateStatus(r.id, "Accepted")}
                      style={{
                        flex: 1,
                        padding: "10px",
                        border: "none",
                        borderRadius: 10,
                        background: "#16a34a",
                        color: "#fff",
                      }}
                    >
                      Accept
                    </button>

                    <button
                      disabled={updating === r.id}
                      onClick={() => updateStatus(r.id, "Rejected")}
                      style={{
                        flex: 1,
                        padding: "10px",
                        border: "none",
                        borderRadius: 10,
                        background: "#dc2626",
                        color: "#fff",
                      }}
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}