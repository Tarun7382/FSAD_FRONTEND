import React, { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSendOtp = async () => {
  try {
    const res = await api.post("/auth/forgot-password", { email });

  alert(res.data?.message || "OTP sent successfully");

    navigate("/verify-otp", {
      state: { email },
    });
  } catch (error) {
    console.error("OTP error:", error);
    alert(error.response?.data || "Failed to send OTP");
  }
};

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Forgot Password</h2>
        <p style={styles.subtitle}>Enter your registered citizen email</p>

        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
          required
        />

        <button onClick={handleSendOtp} style={styles.button}>
          Send OTP
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
    zIndex: 9999,
  },
  card: {
    width: "420px",
    background: "#fff",
    padding: "35px",
    borderRadius: "12px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  title: {
    marginBottom: "10px",
    color: "#2c3e50",
  },
  subtitle: {
    marginBottom: "20px",
    color: "#555",
  },
  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    marginBottom: "20px",
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