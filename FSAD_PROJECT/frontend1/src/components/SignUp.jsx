import React, { useState } from "react";
import "./LoginSignup.css";
import api from "../services/api";

export default function SignUp({ role, onComplete }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [region, setRegion] = useState("");
  const [errors, setErrors] = useState({});
  const [email, setEmail] = useState("");

  const passwordRules =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

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

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

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

    // reset form
    setUsername("");
    setPassword("");
    setRegion("");
    setErrors({});

    if (onComplete) onComplete();
  } catch (error) {
    console.error("Signup error:", error);
    console.error("Response data:", error.response?.data);
    console.error("Status:", error.response?.status);

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
            <input
              type="text"
              placeholder="Enter Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            {errors.username && <p style={{ color: "red" }}>{errors.username}</p>}
            {role === "citizen" && (
  <input
    type="email"
    placeholder="Enter Email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    required
  />
)}
{role === "citizen" && (
  <input
    type="email"
    placeholder="Enter Email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    required
  />
)}

<input
  type="password"
  placeholder="Create password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
/>
            {errors.password && <p style={{ color: "red" }}>{errors.password}</p>}

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
            {errors.region && <p style={{ color: "red" }}>{errors.region}</p>}

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
            {errors.role && <p style={{ color: "red" }}>{errors.role}</p>}

            <button type="submit" className="btn-login citizen-btn">
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
