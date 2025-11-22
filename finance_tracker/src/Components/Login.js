import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
export default function NidhiNanbanLogin() {
  const [loading, setLoading] = useState(false);
  const [userMail, setUserMail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [isLarge, setIsLarge] = useState(typeof window !== 'undefined' ? window.innerWidth >= 768 : true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    function onResize() {
      setIsLarge(window.innerWidth >= 768);
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const page = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#f5f7fa",
    padding: "10px",
    boxSizing: "border-box",
    overflow: "hidden",
  };

  const wrapper = {
    display: "flex",
    width: "100%",
    maxWidth: "1000px",
    maxHeight: "calc(100vh - 20px)",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 6px 24px rgba(3,15,24,0.08)",
    backgroundColor: "#fff",
  };

  const left = {
    flex: "1 1 420px",
    padding: "24px",
    backgroundColor: "#ffffff",
    overflowY: "auto",
    maxHeight: "calc(100vh - 20px)",
  };

  const right = {
    flex: "1 1 480px",
    backgroundColor: "#063F3A",
    color: "#fff",
    padding: "24px",
    display: isLarge ? "flex" : "none",
    flexDirection: "column",
    justifyContent: "space-between",
    overflowY: "auto",
    maxHeight: "calc(100vh - 20px)",
  };

  const logoRow = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "16px",
  };

  const logoBox = {
    width: "44px",
    height: "44px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#063F3A",
    fontWeight: 700,
    fontFamily: "sans-serif",
  };

  const title = { margin: 0, color: "#063F3A" };
  const subtitle = { color: "#888", marginTop: "6px", marginBottom: "18px" };

  const label = { display: "block", fontSize: "14px", color: "#333", marginBottom: "6px", textAlign: "left", fontWeight: "700" };

  const input = {
    width: "100%",
    padding: "10px 12px",
    borderRadius: "8px",
    border: "1px solid #e6e6e6",
    marginBottom: "12px",
    fontSize: "14px",
    backgroundColor: "#fafafa",
    outline: "none",
    boxSizing: "border-box",
  };

  const primaryBtn = {
    width: "100%",
    padding: "12px 14px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#063F3A",
    color: "#fff",
    fontWeight: 700,
    cursor: "pointer",
    fontSize: "15px",
  };

  const ghostBtn = {
    width: "100%",
    padding: "10px 12px",
    borderRadius: "8px",
    border: "1px solid #e6e6e6",
    backgroundColor: "#fff",
    cursor: "pointer",
  };

  const smallText = { fontSize: "13px", color: "#666", textAlign: "center" };

  const analyticsImage = {
    width: "100%",
    borderRadius: "10px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
    marginBottom: "18px",
    objectFit: "cover",
  };

  const analyticsCard = {
    backgroundColor: "rgba(255,255,255,0.06)",
    padding: "14px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: "10px",
  };

  const percentCircle = {
    width: "56px",
    height: "56px",
    borderRadius: "999px",
    backgroundColor: "#fff",
    color: "#063F3A",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userMail,
          password: userPassword
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Login successful! Redirecting...");
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch (err) {
      console.error('Login error:', err);
      setError("Failed to connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={page}>
      <div style={wrapper}>
        {/* LEFT - form */}
        <div style={left}>
          <div style={logoRow}>

            <div>
              <h3 style={{ margin: 0, textAlign: "left" }}>Nidhi Nanban</h3>
              <div style={{ fontSize: "13px", color: "#666" }}>Inventory & Finance Companion</div>
            </div>
          </div>

          <h2 style={{ marginTop: "4px", marginBottom: "4px", fontSize: "20px" }}>Welcome Back</h2>
          <p style={{ ...subtitle, marginBottom: "16px" }}>Login to manage inventory.</p>

          <form onSubmit={handleSubmit}>
            {error && <div style={{ color: 'red', marginBottom: '10px', textAlign: 'center' }}>{error}</div>}
            {success && <div style={{ color: 'green', marginBottom: '10px', textAlign: 'center' }}>{success}</div>}

            <label style={label}>Email</label>
            <input
              style={input}
              placeholder="Enter your email"
              type="email"
              value={userMail}
              onChange={(e) => setUserMail(e.target.value)}
              required
            />

            <label style={label}>Password</label>
            <input
              style={input}
              type="password"
              placeholder="Enter your password"
              value={userPassword}
              onChange={(e) => setUserPassword(e.target.value)}
              required
            />

            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
              <input id="agree" type="checkbox" />
              <label htmlFor="agree" style={{ fontSize: "13px", color: "#444" }}>
                I agree to the <a href="#" style={{ color: "#063F3A", textDecoration: "underline" }}>Terms & Conditions</a>
              </label>
            </div>

            <button type="submit" style={loading ? { ...primaryBtn, opacity: 0.7 } : primaryBtn} disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>

            <div style={{ marginTop: "12px", marginBottom: "8px" }}>
              <div style={smallText}>or</div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <button type="button" style={ghostBtn}>
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" style={{ width: 18, height: 18, marginRight: 8 }} />
                Google
              </button>
              <button type="button" style={ghostBtn}>
                <img src="https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png" alt="FB" style={{ width: 18, height: 18, marginRight: 8 }} />
                Facebook
              </button>
            </div>

            <p style={{ textAlign: "center", marginTop: "14px", color: "#666" }}>
              Don't have an account?
              <a href="/signup" style={{ marginLeft: "6px", textDecoration: "underline", color: "#063F3A" }}>
                Sign Up
              </a>
            </p>
          </form>
        </div>

        {/* RIGHT - finance image + marketing (only shows on medium+ screens) */}
        <div style={right}>
          <div>
            <img
              src="https://images.unsplash.com/photo-1559526324-593bc073d938?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=0f0c6b2a2b9c2bb2acbda0e2f8d6b8df"
              alt="Finance analytics"
              style={analyticsImage}
            />
          </div>

          <div style={{ marginTop: "20px" }}>
            <h3 style={{ margin: 0, fontSize: "20px", fontWeight: 600 }}>Very simple way you can engage</h3>
            <p style={{ marginTop: "0px", color: "rgba(255,255,255,0.9)", lineHeight: 1.5 }}>
              Welcome to NIDHI NANBAN — efficiently track and manage your inventory and finances with ease.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
