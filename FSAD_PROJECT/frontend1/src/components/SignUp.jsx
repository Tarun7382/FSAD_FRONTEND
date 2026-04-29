import React, { useState } from "react";
import "./LoginSignup.css";
import api from "../services/api";

export default function SignUp({ role, onComplete }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [region,   setRegion]   = useState("");
  const [email,    setEmail]    = useState("");
  const [otp,      setOtp]      = useState("");
  const [errors,   setErrors]   = useState({});

  // OTP flow states
  const [otpSent,     setOtpSent]     = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [otpLoading,  setOtpLoading]  = useState(false);
  const [otpError,    setOtpError]    = useState("");
  const [otpSuccess,  setOtpSuccess]  = useState("");

  const passwordRules =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

  // ─── Send OTP ─────────────────────────────────────────────────
  const handleSendOtp = async () => {
    if (!email.trim()) {
      setOtpError("⚠ Please enter your email first.");
      return;
    }
    setOtpError("");
    setOtpSuccess("");
    setOtpLoading(true);
    try {
      await api.post("/auth/signup/send-otp", { email });
      setOtpSent(true);
      setOtpSuccess("✅ OTP sent to " + email);
    } catch (err) {
      setOtpError("❌ " + (err.response?.data?.message || "Failed to send OTP"));
    } finally {
      setOtpLoading(false);
    }
  };

  // ─── Verify OTP ───────────────────────────────────────────────
  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      setOtpError("⚠ Please enter the OTP.");
      return;
    }
    setOtpError("");
    setOtpLoading(true);
    try {
      await api.post("/auth/signup/verify-otp", { email, otp });
      setEmailVerified(true);
      setOtpSuccess("✅ Email verified! You can now sign up.");
      setOtpError("");
    } catch (err) {
      setOtpError("❌ " + (err.response?.data?.message || "Invalid OTP"));
    } finally {
      setOtpLoading(false);
    }
  };

  // ─── Validate ─────────────────────────────────────────────────
  const validateFields = () => {
    const validationErrors = {};

    if (!role) {
      validationErrors.role = "⚠ Role not selected. Go back and choose a role.";
    }
    if (!username.trim()) {
      validationErrors.username = "⚠ Username is required";
    } else if (username.length < 3) {
      validationErrors.username = "⚠ Username must be at least 3 characters";
    }
    if (!password.trim()) {
      validationErrors.password = "⚠ Password is required";
    } else if (!passwordRules.test(password)) {
      validationErrors.password =
        "⚠ Must include uppercase, lowercase, number & special character";
    }
    if (!region) {
      validationErrors.region = "⚠ Please select your city";
    }
    if (role === "citizen" && !emailVerified) {
      validationErrors.email = "⚠ Please verify your email first";
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  // ─── Signup ───────────────────────────────────────────────────
  const handleSignUp = async (e) => {
    e.preventDefault();

    if (role === "politician" || role === "admin") {
      alert(`${role} accounts can only be created by admin.`);
      return;
    }

    if (!validateFields()) return;

    try {
      await api.post("/auth/signup", {
        username,
        email: role === "citizen" ? email : null,
        password,
        role,
        region,
      });

      alert("✅ Account created successfully!");
      setUsername("");
      setPassword("");
      setRegion("");
      setEmail("");
      setOtp("");
      setOtpSent(false);
      setEmailVerified(false);
      setErrors({});

      if (onComplete) onComplete();
    } catch (error) {
      if (error.response?.status === 409) {
        setErrors({ username: "⚠ Username already exists!" });
      } else {
        alert("❌ Signup failed. Check browser console (F12).");
      }
    }
  };

  return (
    <div className="login-background signup-background">
      <div className="login-container">
        <div className="login-header" style={{ background: "#3498db" }}>
          <h2>Create Account</h2>
        </div>

        <div className="login-body">
          <form onSubmit={handleSignUp}>

            {/* Username */}
            <input
              type="text"
              placeholder="Enter Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            {errors.username && (
              <p style={{ color: "red" }}>{errors.username}</p>
            )}

            {/* Email + OTP (citizen only) */}
            {role === "citizen" && (
              <>
                {/* Email row */}
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <input
                    type="email"
                    placeholder="Enter Email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setOtpSent(false);
                      setEmailVerified(false);
                      setOtpSuccess("");
                      setOtpError("");
                    }}
                    disabled={emailVerified}
                    style={{ flex: 1 }}
                  />
                  {!emailVerified && (
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={otpLoading}
                      style={{
                        padding: "10px 14px",
                        background: "#3498db",
                        color: "#fff",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                        fontWeight: "600",
                      }}
                    >
                      {otpLoading ? "Sending..." : otpSent ? "Resend OTP" : "Send OTP"}
                    </button>
                  )}
                  {emailVerified && (
                    <span style={{ color: "green", fontWeight: "600" }}>✅ Verified</span>
                  )}
                </div>
                {errors.email && (
                  <p style={{ color: "red" }}>{errors.email}</p>
                )}

                {/* OTP input — shown after OTP sent */}
                {otpSent && !emailVerified && (
                  <div style={{ display: "flex", gap: "8px", alignItems: "center", marginTop: "8px" }}>
                    <input
                      type="text"
                      placeholder="Enter OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      maxLength={6}
                      style={{ flex: 1, letterSpacing: "4px", textAlign: "center" }}
                    />
                    <button
                      type="button"
                      onClick={handleVerifyOtp}
                      disabled={otpLoading}
                      style={{
                        padding: "10px 14px",
                        background: "#2ecc71",
                        color: "#fff",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontWeight: "600",
                      }}
                    >
                      {otpLoading ? "Verifying..." : "Verify OTP"}
                    </button>
                  </div>
                )}

                {/* OTP messages */}
                {otpError   && <p style={{ color: "red",   marginTop: "4px" }}>{otpError}</p>}
                {otpSuccess  && <p style={{ color: "green", marginTop: "4px" }}>{otpSuccess}</p>}
              </>
            )}

            {/* Password */}
            <input
              type="password"
              placeholder="Create password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && (
              <p style={{ color: "red" }}>{errors.password}</p>
            )}

            {/* Region */}
            <label style={{ marginTop: "10px" }}>Select Region (City)</label>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              style={{ padding: "10px", width: "100%", borderRadius: "8px" }}
            >
              <option value="">-- Select City --</option>
              <option value="Vijayawada">Vijayawada</option>
              <option value="Guntur">Guntur</option>
              <option value="Vizag">Vizag</option>
              <option value="Tirupati">Tirupati</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Bangalore">Bangalore</option>
              <option value="Chennai">Chennai</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Delhi">Delhi</option>
            </select>
            {errors.region && (
              <p style={{ color: "red" }}>{errors.region}</p>
            )}

            {/* Role (read-only) */}
            <label>Role:</label>
            <input
              type="text"
              value={role ? role.toUpperCase() : "NOT SELECTED"}
              readOnly
              disabled
              style={{
                background: "#eee",
                fontWeight: "600",
                marginBottom: "10px",
                padding: "8px",
              }}
            />
            {errors.role && (
              <p style={{ color: "red" }}>{errors.role}</p>
            )}

            {/* Sign Up button — only shows after email verified */}
            {(role !== "citizen" || emailVerified) && (
              <button type="submit" className="btn-login citizen-btn">
                Sign Up
              </button>
            )}

          </form>
        </div>
      </div>
    </div>
  );
}