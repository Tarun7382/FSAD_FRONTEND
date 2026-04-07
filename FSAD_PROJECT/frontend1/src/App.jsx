import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";

import RoleSelection from "./components/RoleSelection";
import LoginPage from "./components/LoginPage";
import SignUp from "./components/SignUp";
import Sidebar from "./components/Sidebar";
import CitizenSection from "./components/CitizenSection";
import PoliticianSection from "./components/PoliticianSection";
import ModeratorSection from "./components/ModeratorSection";
import AdminSection from "./components/AdminSection";
import { ReportProvider } from "./components/ReportContext";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyOtp from "./pages/VerifyOtp";
import "./App.css";

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();

  const [page,     setPage]     = useState("home");
  const [role,     setRole]     = useState("");
  const [username, setUsername] = useState("");
  const [section,  setSection]  = useState("");

  // ─── Restore session on page refresh ──────────────────────────
  useEffect(() => {
    const savedUsername = localStorage.getItem("username");
    const savedRole     = localStorage.getItem("role");
    const savedToken    = localStorage.getItem("token");

    if (savedUsername && savedRole && savedToken) {
      setUsername(savedUsername);
      setRole(savedRole);
      setSection(savedRole);
      setPage("main");
      navigate("/dashboard");
    } else if (location.pathname === "/") {
      navigate("/home");
    }
  }, []);

  // ─── URL → page sync ──────────────────────────────────────────
  useEffect(() => {
    if      (location.pathname === "/home")      setPage("home");
    else if (location.pathname === "/login")     setPage("login");
    else if (location.pathname === "/signup")    setPage("signup");
    else if (location.pathname === "/dashboard") setPage("main");
    else                                         setPage("home");
  }, [location.pathname]);

  // ─── Role Selection ───────────────────────────────────────────
  const handleRoleSelect = (selectedRole) => {
    const r = selectedRole.toLowerCase().trim();
    setRole(r);
    setPage("login");
    navigate("/login");
  };

  // ─── Login ────────────────────────────────────────────────────
  const handleLogin = (uname, userRole) => {
    const r = (userRole || "").toLowerCase().trim();

    // ✅ Save ALL keys — each used by different parts of the app
    localStorage.setItem("token",    "dummy-token");   // ← was MISSING
    localStorage.setItem("username", uname);           // ← was MISSING
    localStorage.setItem("role",     r);               // ← was MISSING
    localStorage.setItem("currentUser", JSON.stringify({
      username: uname,
      role:     r,
      region:   "ALL",
    }));

    console.log("✅ Login saved:", uname, r);          // debug

    setUsername(uname);
    setRole(r);
    setSection(r);
    setPage("main");
    navigate("/dashboard");
  };

  // ─── Signup Complete ──────────────────────────────────────────
  const handleSignupComplete = () => {
    setPage("login");
    navigate("/login");
  };

  // ─── Logout ───────────────────────────────────────────────────
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    localStorage.removeItem("currentUser");
    setPage("home");
    setRole("");
    setUsername("");
    setSection("");
    navigate("/home");
  };

  // ─── Render ───────────────────────────────────────────────────
  return (
    <>
      {page === "home" && (
        <RoleSelection onSelect={handleRoleSelect} />
      )}

      {page === "login" && (
        <LoginPage
          role={role}
          onLogin={handleLogin}
          onBack={() => { setPage("home"); navigate("/home"); }}
          onSignup={() => { setPage("signup"); navigate("/signup"); }}
        />
      )}

      {page === "signup" && (
        <SignUp role={role} onComplete={handleSignupComplete} />
      )}

      {page === "main" && section && (
        <div className="main-background">
          <Sidebar
            role={section}
            active={section}
            setActiveSection={setSection}
            onLogout={handleLogout}
          />

          <div className="content">
            <header>
              <div className="user-info">
                <i className="fas fa-user-circle"></i>{" "}
                <strong>{username}</strong> —{" "}
                <span style={{ textTransform: "capitalize" }}>{section}</span>
              </div>
              <h2>Citizen &amp; Politician Interaction Platform</h2>
              <p>Transparency | Engagement | Responsiveness</p>
            </header>

            {section === "citizen"    && <CitizenSection    username={username} />}
            {section === "politician" && <PoliticianSection username={username} />}
            {section === "moderator"  && <ModeratorSection  username={username} />}
            {section === "admin"      && <AdminSection      username={username} />}

            {!["citizen","politician","moderator","admin"].includes(section) && (
              <div style={{ padding: 40, color: "red" }}>
                ⚠️ Unknown section: "<strong>{section}</strong>"
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default function App() {
  return (
    <ReportProvider>
      <Router>
        <Routes>
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp"      element={<VerifyOtp />} />
          <Route path="/reset-password"  element={<ResetPassword />} />
          <Route path="/*"               element={<AppContent />} />
          
        </Routes>
      </Router>
    </ReportProvider>
  );
}