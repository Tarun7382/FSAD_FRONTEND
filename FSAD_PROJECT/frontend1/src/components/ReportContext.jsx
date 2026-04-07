import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const ReportContext = createContext();

export function ReportProvider({ children }) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);

 useEffect(() => {
  fetchAllReports();

  const interval = setInterval(() => {
    fetchAllReports();
  }, 2000); // every 2 seconds

  return () => clearInterval(interval);
}, []);

  const fetchAllReports = async () => {
    try {
      setLoading(true);
      const res = await api.get("/reports/all");
      setReports(res.data);
    } catch (err) {
      console.error("Failed to fetch reports:", err);
    } finally {
      setLoading(false);
    }
  };

  const addReport = async (reportData) => {
    try {
      const res = await api.post("/reports/submit", reportData);
      setReports((prev) => [...prev, res.data]);
      return { success: true };
    } catch (err) {
      console.error("Submit failed:", err);
      return { success: false };
    }
  };

  const updateReport = async (id, updates) => {
    try {
      await api.put(`/reports/update/${id}`, updates);
      setReports((prev) =>
        prev.map((r) => (r.id === id ? { ...r, ...updates } : r))
      );
      return { success: true };
    } catch (err) {
      console.error("Update failed:", err);
      return { success: false };
    }
  };

  // ✅ ADD THIS
  const toggleVerify = async (id) => {
    return await updateReport(id, {
      verified: true,
      status: "Verified"
    });
  };

  // ✅ ADD THIS
 const updateReportStatus = async (id, status) => {
  try {
    await api.put(`/reports/update/${id}`, { status });

    // force instant live rerender everywhere
    setReports((prev) =>
      prev.map((r) =>
        String(r.id) === String(id)
          ? { ...r, status: String(status).trim() }
          : r
      )
    );

    return { success: true };
  } catch (err) {
    console.error("Status update failed:", err);
    return { success: false };
  }
};
  const submitFeedback = async (id, feedback) => {
    try {
      await api.put(`/reports/feedback/${id}`, { feedback });
      setReports((prev) =>
        prev.map((r) => (r.id === id ? { ...r, feedback } : r))
      );
      return { success: true };
    } catch (err) {
      console.error("Feedback failed:", err);
      return { success: false };
    }
  };

  return (
    <ReportContext.Provider
      value={{
        reports,
        loading,
        addReport,
        updateReport,
        toggleVerify,
        updateReportStatus,
        submitFeedback,
        fetchAllReports
      }}
    >
      {children}
    </ReportContext.Provider>
  );
}

export function useReports() {
  return useContext(ReportContext);
}