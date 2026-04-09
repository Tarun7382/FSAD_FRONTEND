import React, { useState, useEffect } from "react";
import { useReports } from "./ReportContext";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

  .admin-root {
    font-family: 'DM Sans', sans-serif;
    background: #0a0e1a;
    min-height: 100vh;
    color: #e2e8f0;
    padding: 32px;
  }

  .admin-header {
    margin-bottom: 36px;
  }

  .admin-header h2 {
    font-family: 'Syne', sans-serif;
    font-size: 2rem;
    font-weight: 800;
    background: linear-gradient(135deg, #e2e8f0 0%, #94a3b8 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0 0 6px 0;
    letter-spacing: -0.5px;
  }

  .admin-header p {
    color: #64748b;
    font-size: 0.9rem;
    margin: 0;
    font-weight: 300;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 16px;
    margin-bottom: 28px;
  }

  .stat-card {
    background: #111827;
    border: 1px solid #1e293b;
    border-radius: 16px;
    padding: 20px 22px;
    position: relative;
    overflow: hidden;
    transition: transform 0.2s ease, border-color 0.2s ease;
  }

  .stat-card:hover {
    transform: translateY(-2px);
    border-color: #334155;
  }

  .stat-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
  }

  .stat-card.total::before { background: linear-gradient(90deg, #6366f1, #818cf8); }
  .stat-card.pending::before { background: linear-gradient(90deg, #f59e0b, #fbbf24); }
  .stat-card.resolved::before { background: linear-gradient(90deg, #10b981, #34d399); }
  .stat-card.priority::before { background: linear-gradient(90deg, #ef4444, #f87171); }

  .stat-icon {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.1rem;
    margin-bottom: 14px;
  }

  .stat-card.total .stat-icon { background: rgba(99,102,241,0.15); }
  .stat-card.pending .stat-icon { background: rgba(245,158,11,0.15); }
  .stat-card.resolved .stat-icon { background: rgba(16,185,129,0.15); }
  .stat-card.priority .stat-icon { background: rgba(239,68,68,0.15); }

  .stat-label {
    font-size: 0.72rem;
    font-weight: 500;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 4px;
  }

  .stat-value {
    font-family: 'Syne', sans-serif;
    font-size: 2rem;
    font-weight: 700;
    color: #f1f5f9;
    line-height: 1;
  }

  .section-card {
    background: #111827;
    border: 1px solid #1e293b;
    border-radius: 20px;
    padding: 24px;
    margin-bottom: 20px;
  }

  .section-card h4 {
    font-family: 'Syne', sans-serif;
    font-size: 1rem;
    font-weight: 600;
    color: #cbd5e1;
    margin: 0 0 20px 0;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .section-card h4::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #1e293b;
    margin-left: 8px;
  }

  .add-user-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: linear-gradient(135deg, #6366f1, #4f46e5);
    color: #fff;
    border: none;
    border-radius: 12px;
    padding: 11px 22px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    margin-bottom: 20px;
    box-shadow: 0 4px 15px rgba(99,102,241,0.3);
  }

  .add-user-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(99,102,241,0.45);
  }

  .add-user-btn.close {
    background: linear-gradient(135deg, #374151, #1f2937);
    box-shadow: none;
  }

  .user-form {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
  }

  .user-form .full-width {
    grid-column: 1 / -1;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .form-group label {
    font-size: 0.75rem;
    font-weight: 500;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  .form-input, .form-select {
    background: #0a0e1a;
    border: 1px solid #1e293b;
    border-radius: 10px;
    padding: 11px 14px;
    color: #e2e8f0;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.875rem;
    width: 100%;
    box-sizing: border-box;
    transition: border-color 0.2s ease;
    outline: none;
  }

  .form-input:focus, .form-select:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
  }

  .form-input::placeholder { color: #374151; }

  .form-select option {
    background: #111827;
  }

  .save-btn {
    background: linear-gradient(135deg, #10b981, #059669);
    color: #fff;
    border: none;
    border-radius: 10px;
    padding: 11px 24px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    width: 100%;
    box-shadow: 0 4px 12px rgba(16,185,129,0.25);
  }

  .save-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 18px rgba(16,185,129,0.4);
  }

  .report-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .report-item {
    background: #0a0e1a;
    border: 1px solid #1e293b;
    border-radius: 14px;
    padding: 18px;
    transition: border-color 0.2s ease;
  }

  .report-item:hover {
    border-color: #334155;
  }

  .report-meta {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 12px;
    flex-wrap: wrap;
  }

  .ticket-id {
    font-family: 'Syne', sans-serif;
    font-size: 0.75rem;
    font-weight: 600;
    color: #6366f1;
    background: rgba(99,102,241,0.1);
    padding: 3px 10px;
    border-radius: 20px;
    border: 1px solid rgba(99,102,241,0.2);
  }

  .status-badge {
    font-size: 0.7rem;
    font-weight: 600;
    padding: 3px 10px;
    border-radius: 20px;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  .status-badge.Pending { background: rgba(245,158,11,0.15); color: #fbbf24; border: 1px solid rgba(245,158,11,0.25); }
  .status-badge.Accepted { background: rgba(59,130,246,0.15); color: #60a5fa; border: 1px solid rgba(59,130,246,0.25); }
  .status-badge.Resolved { background: rgba(16,185,129,0.15); color: #34d399; border: 1px solid rgba(16,185,129,0.25); }
  .status-badge.Rejected { background: rgba(239,68,68,0.15); color: #f87171; border: 1px solid rgba(239,68,68,0.25); }

  .priority-badge {
    font-size: 0.7rem;
    font-weight: 500;
    padding: 3px 10px;
    border-radius: 20px;
  }

  .priority-badge.High { background: rgba(239,68,68,0.1); color: #f87171; }
  .priority-badge.Medium { background: rgba(245,158,11,0.1); color: #fbbf24; }
  .priority-badge.Low { background: rgba(16,185,129,0.1); color: #34d399; }

  .report-title {
    font-family: 'Syne', sans-serif;
    font-size: 0.95rem;
    font-weight: 600;
    color: #e2e8f0;
    margin: 0 0 10px 0;
  }

  .report-details {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 8px;
    margin-bottom: 12px;
  }

  .report-detail-item {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .detail-label {
    font-size: 0.65rem;
    font-weight: 500;
    color: #475569;
    text-transform: uppercase;
    letter-spacing: 0.07em;
  }

  .detail-value {
    font-size: 0.8rem;
    color: #94a3b8;
  }

  .report-image {
    width: 160px;
    height: 100px;
    object-fit: cover;
    border-radius: 10px;
    margin-bottom: 12px;
    border: 1px solid #1e293b;
  }

  .resolve-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: linear-gradient(135deg, #10b981, #059669);
    color: #fff;
    border: none;
    border-radius: 9px;
    padding: 8px 18px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.8rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 3px 10px rgba(16,185,129,0.2);
  }

  .resolve-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 5px 15px rgba(16,185,129,0.35);
  }

  .empty-state {
    text-align: center;
    padding: 40px 20px;
    color: #475569;
    font-size: 0.9rem;
  }

  .charts-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-bottom: 20px;
  }

  @media (max-width: 768px) {
    .charts-grid { grid-template-columns: 1fr; }
    .user-form { grid-template-columns: 1fr; }
    .admin-root { padding: 20px; }
  }
`;

const StatCard = ({ className, icon, label, value }) => (
  <div className={`stat-card ${className}`}>
    <div className="stat-icon">{icon}</div>
    <div className="stat-label">{label}</div>
    <div className="stat-value">{value}</div>
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: '#1e293b', border: '1px solid #334155',
        borderRadius: '10px', padding: '10px 14px', fontSize: '0.8rem', color: '#e2e8f0'
      }}>
        <p style={{ margin: 0, color: '#94a3b8' }}>{label}</p>
        <p style={{ margin: '4px 0 0', fontWeight: 600 }}>{payload[0].value}</p>
      </div>
    );
  }
  return null;
};

export default function AdminSection() {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newUser, setNewUser] = useState({ username: "", password: "", role: "citizen", region: "" });

  const { reports, updateReportStatus } = useReports();

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
    setUsers(storedUsers);
  }, []);

  const saveUsers = (updated) => {
    setUsers(updated);
    localStorage.setItem("users", JSON.stringify(updated));
  };

  const handleAddUser = async () => {
    if (!newUser.username || !newUser.password) { alert("⚠ Username & Password required"); return; }
    if (newUser.role === "politician" && !newUser.region) { alert("⚠ Politician must be assigned a ward/region."); return; }
    if (newUser.role !== "moderator" && !newUser.region) { alert("⚠ Region is required for Citizen & Politician"); return; }

    try {
      const payload = {
        username: newUser.username.trim(),
        password: newUser.password.trim(),
        role: newUser.role.toLowerCase(),
        region: newUser.region?.trim() || "",
      };
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (response.ok) {
        alert("✅ User created successfully");
        saveUsers([...users, payload]);
        setShowForm(false);
        setNewUser({ username: "", password: "", role: "citizen", region: "" });
      } else {
        alert("❌ " + data.message);
      }
    } catch (error) {
      alert("❌ Backend connection failed");
    }
  };

  const userCounts = [
    { name: "Citizens", value: users.filter((u) => u.role === "citizen").length },
    { name: "Politicians", value: users.filter((u) => u.role === "politician").length },
    { name: "Moderators", value: users.filter((u) => u.role === "moderator").length },
  ];

  const statusCounts = [
    { name: "Pending", value: reports.filter((r) => r.status === "Pending").length },
    { name: "Accepted", value: reports.filter((r) => r.status === "Accepted").length },
    { name: "Resolved", value: reports.filter((r) => r.status === "Resolved").length },
    { name: "Rejected", value: reports.filter((r) => r.status === "Rejected").length },
  ];
  const updateStatus = async (id, newStatus) => {
  setUpdating(id);

  try {
    await updateReportStatus(id, newStatus);
  } catch (error) {
    console.error("Update failed", error);
  } finally {
    setUpdating(null);
  }
};

  const PIE_COLORS = ["#f59e0b", "#3b82f6", "#10b981", "#ef4444"];
  const BAR_COLORS = ["#6366f1", "#8b5cf6", "#a78bfa"];

  const totalReports = reports.length;
  const pendingReports = reports.filter((r) => r.status === "Pending").length;
  const resolvedReports = reports.filter((r) => r.status === "Resolved").length;
  const highPriorityReports = reports.filter((r) => r.priority === "High").length;

  return (
    <>
      <style>{styles}</style>
      <div className="admin-root">
        <div className="admin-header">
          <h2>Admin Dashboard</h2>
          <p>System administration, analytics & issue resolution</p>
        </div>

        <div className="stats-grid">
          <StatCard className="total" icon="📋" label="Total Reports" value={totalReports} />
          <StatCard className="pending" icon="⏳" label="Pending" value={pendingReports} />
          <StatCard className="resolved" icon="✅" label="Resolved" value={resolvedReports} />
          <StatCard className="priority" icon="🔥" label="High Priority" value={highPriorityReports} />
        </div>

        <div className="charts-grid">
          <div className="section-card">
            <h4>User Overview</h4>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={userCounts} barSize={36}>
                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {userCounts.map((_, i) => (
                    <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="section-card">
            <h4>Report Status Distribution</h4>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={statusCounts}
                  dataKey="value"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  stroke="none"
                >
                  {statusCounts.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  formatter={(val) => <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{val}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <button className={`add-user-btn ${showForm ? 'close' : ''}`} onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Cancel' : '＋ Add User'}
        </button>

        {showForm && (
          <div className="section-card" style={{ marginBottom: '20px' }}>
            <h4>New User</h4>
            <div className="user-form">
              <div className="form-group">
                <label>Username</label>
                <input className="form-input" type="text" placeholder="Enter username"
                  value={newUser.username}
                  onChange={(e) => setNewUser({ ...newUser, username: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input className="form-input" type="password" placeholder="Enter password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Role</label>
                <select className="form-select" value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}>
                  <option value="citizen">Citizen</option>
                  <option value="politician">Politician</option>
                  <option value="moderator">Moderator</option>
                </select>
              </div>
              {newUser.role !== "moderator" && (
                <div className="form-group">
                  <label>{newUser.role === "politician" ? "Ward / Constituency" : "Region / City"}</label>
                  <input className="form-input" type="text"
                    placeholder={newUser.role === "politician" ? "e.g. Ward 4, Vijayawada" : "e.g. Vijayawada"}
                    value={newUser.region}
                    onChange={(e) => setNewUser({ ...newUser, region: e.target.value })} />
                </div>
              )}
              <div className="form-group full-width">
                <button className="save-btn" onClick={handleAddUser}>Save User</button>
              </div>
            </div>
          </div>
        )}

        <div className="section-card">
          <h4>All Reports</h4>
          {reports.length > 0 ? (
            <div className="report-list">
              {reports.map((r) => (
                <div key={r.id} className="report-item">
                  <div className="report-meta">
                    <span className="ticket-id">{r.ticketId}</span>
                    <span className={`status-badge ${r.status}`}>{r.status}</span>
                    <span className={`priority-badge ${r.priority}`}>{r.priority}</span>
                  </div>

                  {r.image && <img src={r.image} alt="Issue" className="report-image" />}

                  <div className="report-title">{r.text}</div>

                  <div className="report-details">
                    <div className="report-detail-item">
                      <span className="detail-label">Ward</span>
                      <span className="detail-value">{r.wardNumber || "—"}</span>
                    </div>
                    <div className="report-detail-item">
                      <span className="detail-label">Landmark</span>
                      <span className="detail-value">{r.landmark || "—"}</span>
                    </div>
                    <div className="report-detail-item">
                      <span className="detail-label">Category</span>
                      <span className="detail-value">{r.category}</span>
                    </div>
                    <div className="report-detail-item">
                      <span className="detail-label">Region</span>
                      <span className="detail-value">{r.region}</span>
                    </div>
                    <div className="report-detail-item">
                      <span className="detail-label">Feedback</span>
                      <span className="detail-value">{r.feedback ? `${r.feedback} ⭐` : "Not rated"}</span>
                    </div>
                    <div className="report-detail-item">
                      <span className="detail-label">Date</span>
                      <span className="detail-value">{r.date}</span>
                    </div>
                  </div>

                 {String(r.status).trim().toLowerCase() === "accepted" && (
  <button
    className="resolve-btn"
    onClick={() => updateReportStatus(r.id, "Resolved")}
  >
    ✓ Mark Resolved
  </button>
)}
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>📭</div>
              <p>No reports available yet</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}