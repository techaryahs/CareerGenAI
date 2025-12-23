import React, { useState } from "react";
import axios from "axios";
import "../styles/Login.css";
import "../styles/Register.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setIsSubmitting(true);

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/login`,
        {
          email: email.trim(),
          password: password.trim()
        }
      );

      const { token, user } = res.data; // ✅ FIX
      const role = user.role;           // ✅ FIX

      // =========================
      // SAVE AUTH DATA
      // =========================
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("userEmail", user.email);
      localStorage.setItem("role", role);

      console.log("✅ Logged in user:", user);

      // =========================
      // ROLE BASED REDIRECT
      // =========================
      setTimeout(() => {
        // Admin (hardcoded)
        if (
          (email === "arprs9076@gmail.com" && password === "Admin@123") ||
          (email === "careergenai9@gmail.com" && password === "Admin@123")
        ) {
          window.location.href = "/admin-dashboard";
        }
        // Consultant
        else if (role === "consultant") {
          window.location.href = "/consultant-dashboard";
        }
        // Parent
        else if (role === "parent") {
          window.location.href = "/parent-dashboard";
        }
        // Teacher
        else if (role === "teacher") {
          window.location.href = "/teacher-dashboard";
        }
        // Student (default)
        else {
          window.location.href = "/";
        }
      }, 800);

    } catch (err) {
      console.error("❌ Login error:", err.response?.data || err.message);
      setErrorMsg(err.response?.data?.error || "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        {/* Left Side */}
        <div className="login-info">
          <h1>Welcome Back 👋</h1>
          <p>
            Login to continue your journey with <b>CareerGenAI</b>.
          </p>
          <img
            src="https://cdn-icons-png.flaticon.com/512/2922/2922510.png"
            alt="login illustration"
            className="login-illustration"
          />
        </div>

        {/* Right Side */}
        <div className="login-box">
          <h2>Sign In</h2>
          <p className="subtitle">Access your CareerGenAI account</p>

          <form onSubmit={handleLogin}>
            <div className="form-grid">
              <div style={{ gridColumn: "span 2" }}>
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div style={{ gridColumn: "span 2" }}>
                <label>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button className="sub-btn" disabled={isSubmitting}>
              {isSubmitting ? "Logging in..." : "Login"}
            </button>
          </form>

          {errorMsg && <p className="error-message">{errorMsg}</p>}

          <p className="register-link">
            Don’t have an account? <a href="/register">Register here</a>
          </p>
          <p className="forgot-link">
            <a href="/forgot-password">Forgot Password?</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
