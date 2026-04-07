import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SignUp from "./SignUp";
import "./LoginSignup.css";
import api from "../services/api";
import PasswordInput from "../components/PasswordInput";

export default function LoginPage({ role, onLogin, onBack }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showSignUp, setShowSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // ✅ Safety guard — if role prop is missing, nothing works
  const safeRole = role ? role.toLowerCase().trim() : "";

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError("");

    if (!safeRole) {
      setError("Role is missing. Please go back and select a role.");
      return;
    }

    setLoading(true);

    const payload = {
      username: username.trim(),
      password: password.trim(),
      role: safeRole,
    };

    console.log("📤 Sending login payload:", payload);

    try {
      const res = await api.post("/auth/login", payload);

      console.log("✅ Login response:", res.data);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("username", res.data.username);

      alert(`✅ Welcome back, ${res.data.username}!`);
      onLogin(res.data.username, res.data.role);
    } catch (error) {
      console.error("❌ Login error:", error);
      console.error("❌ Response data:", error.response?.data);
      console.error("❌ Status:", error.response?.status);

      const serverMsg = error.response?.data;
      if (typeof serverMsg === "string") {
        setError(serverMsg);
      } else {
        setError("Invalid username, password, or role.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignUpComplete = () => {
    alert("✅ Account created successfully! You can now log in.");
    setShowSignUp(false);
  };

  return (
    <div
      className={`login-background ${
        safeRole === "citizen"
          ? "citizen-login"
          : safeRole === "politician"
          ? "politician-login"
          : "admin-login"
      }`}
    >
      {!showSignUp ? (
        <div className="login-container">
          {/* Header */}
          <div
            className={`login-header ${
              safeRole === "citizen"
                ? "citizen-header"
                : safeRole === "politician"
                ? "politician-header"
                : "admin-header"
            }`}
          >
            <h2>
              {safeRole
                ? safeRole.charAt(0).toUpperCase() + safeRole.slice(1)
                : "User"}{" "}
              Login
            </h2>
          </div>

          {/* Body */}
          <div className="login-body">
            {error && (
              <div
                style={{
                  background: "#c0392b",
                  color: "#fff",
                  padding: "10px 14px",
                  borderRadius: 8,
                  marginBottom: 16,
                  fontSize: 14,
                  textAlign: "center",
                }}
              >
                ❌ {error}
              </div>
            )}

            <form onSubmit={handleSignIn}>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />

              <PasswordInput
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  placeholder="Enter password"
/>
              <button
                type="submit"
                disabled={loading}
                className={`btn-login ${
                  safeRole === "citizen"
                    ? "citizen-btn"
                    : safeRole === "politician"
                    ? "politician-btn"
                    : "admin-btn"
                }`}
                style={{ opacity: loading ? 0.7 : 1 }}
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>
          </div>

          {/* Footer */}
          <div className="login-footer">
            <p>
              {role === "citizen" && (
                <>
                  Don’t have an account?{" "}
                  <span
                    onClick={() => setShowSignUp(true)}
                    style={{
                      color: "#3498db",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                  >
                    Sign Up
                  </span>{" "}
                  |{" "}
                  <span
                    onClick={() => navigate("/forgot-password")}
                    style={{
                      color: "#e67e22",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                  >
                    Forgot Password?
                  </span>{" "}
                  |{" "}
                </>
              )}

              <span
                onClick={onBack}
                style={{
                  color: "#555",
                  cursor: "pointer",
                  fontWeight: "500",
                }}
              >
                ⬅ Back
              </span>
            </p>
          </div>
        </div>
      ) : (
        <SignUp role={safeRole} onComplete={handleSignUpComplete} />
      )}
    </div>
  );
}