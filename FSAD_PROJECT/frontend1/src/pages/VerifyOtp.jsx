import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;

const handleVerifyOtp = async () => {
  if (!otp.trim()) {
    alert("Please enter the OTP.");
    return;
  }

  try {
    const res = await api.post("/auth/verify-otp", { email, otp });

    console.log("OTP response:", res.data); // ✅ see exactly what backend returns

    // ✅ Handle all possible response shapes
    const message =
      typeof res.data === "string"
        ? res.data
        : res.data?.message
        ?? res.data?.status
        ?? "OTP Verified Successfully!";

    alert(message);
    navigate("/reset-password", { state: { email } });

  } catch (error) {
    console.error("OTP error:", error.response?.data); // ✅ see exact error

    const errData = error.response?.data;
    const message =
      typeof errData === "string"
        ? errData
        : errData?.message
        ?? errData?.error
        ?? "Invalid or expired OTP.";

    alert(message);
  }
};

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2>Verify OTP</h2>
        <p>Enter OTP sent to your email</p>

        <input
          type="text"
          placeholder="Enter 6-digit OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          style={styles.input}
        />

        <button onClick={handleVerifyOtp} style={styles.button}>
          Verify OTP
        </button>
      </div>
    </div>
  );
}

const styles = {
  page: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4f6f8",
  },
  card: {
    width: "420px",
    background: "#fff",
    padding: "35px",
    borderRadius: "12px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: "12px",
    marginTop: "15px",
    marginBottom: "20px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    boxSizing: "border-box",
  },
  button: {
    width: "100%",
    padding: "12px",
    border: "none",
    borderRadius: "6px",
    background: "#007bff",
    color: "#fff",
    fontWeight: "600",
    cursor: "pointer",
  },
};