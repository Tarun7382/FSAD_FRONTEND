import { useEffect } from "react";
import { useReports } from "./ReportContext";

export default function ModeratorSection() {
  const {
    reports,
    fetchAllReports,
    toggleVerify,
    updateReportStatus,
  } = useReports();

  // ✅ Refresh latest reports when moderator page opens
  useEffect(() => {
    fetchAllReports();
  }, []);

  const unverifiedReports = reports.filter((r) => {
    const status = String(r.status || "").toLowerCase().trim();

    return ![
      "verified",
      "flagged",
      "accepted",
      "rejected",
      "resolved",
    ].includes(status);
  });

  return (
    <div className="dashboard-section">
      <h3>Moderator Dashboard</h3>

      {unverifiedReports.length > 0 ? (
        unverifiedReports.map((r) => (
          <div key={r.id} className="card">
            <p><b>Ticket ID:</b> {r.ticketId}</p>
            <h4>{r.title || "Issue Report"}</h4>
            <p>{r.text}</p>

            <p><b>Category:</b> {r.category}</p>
            <p><b>Ward:</b> {r.wardNumber || "Not Assigned"}</p>
            <p><b>Landmark:</b> {r.landmark || "Not Provided"}</p>

            {r.image && (
              <img
                src={r.image}
                alt="Issue"
                style={{
                  width: "220px",
                  marginTop: "10px",
                  borderRadius: "8px",
                }}
              />
            )}

            <p><b>Reported by:</b> {r.createdBy || "Citizen"}</p>
            <p><b>Status:</b> {r.status}</p>

            <button
              className="btn-login"
              onClick={() => toggleVerify(r.id)}
            >
              Verify Report
            </button>

            <button
              className="btn-login"
              style={{ background: "red", marginLeft: "10px" }}
              onClick={() => updateReportStatus(r.id, "Flagged")}
            >
              Flag
            </button>
          </div>
        ))
      ) : (
        <p>No reports to moderate.</p>
      )}
    </div>
  );
}