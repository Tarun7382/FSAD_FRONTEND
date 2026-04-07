import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;

  const handleResetPassword = async () => {
    try {
      const res = await api.post("/auth/reset-password", {
        email,
        newPassword,
      });

      alert(res.data.message);
      navigate("/");
    } catch (error) {
      alert(error.response?.data || "Failed to reset password");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2>Reset Password</h2>
        <p>Enter your new password</p>

     <input
  type="password"
  value={newPassword}
  onChange={(e) => setNewPassword(e.target.value)}
  placeholder="New Password"
  style={styles.input}
/>

        <button onClick={handleResetPassword} style={styles.button}>
          Reset Password
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