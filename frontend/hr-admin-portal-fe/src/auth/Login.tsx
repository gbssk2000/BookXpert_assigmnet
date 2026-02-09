import { useState } from "react";
import { login } from "./AuthService";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await login({ username, password });
      localStorage.setItem("token", result.token);
      navigate("/home");
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid username or password");
    } finally {
      setIsLoading(false);
    }
  };

  const styles = {
    container: {
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #0f0f23 0%, #1a1a3e 100%)",
      padding: "1rem",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    },
    card: {
      width: "100%",
      maxWidth: "400px",
      background: "rgba(15, 15, 35, 0.8)",
      backdropFilter: "blur(10px)",
      border: "1px solid rgba(59, 130, 246, 0.3)",
      borderRadius: "12px",
      padding: "2.5rem",
      boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)"
    },
    header: {
      textAlign: "center" as const,
      marginBottom: "2rem"
    },
    title: {
      fontSize: "2rem",
      fontWeight: 700,
      background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      marginBottom: "0.5rem"
    },
    subtitle: {
      color: "rgba(255, 255, 255, 0.6)",
      fontSize: "0.95rem"
    },
    form: {
      display: "flex",
      flexDirection: "column" as const,
      gap: "1.5rem"
    },
    formGroup: {
      display: "flex",
      flexDirection: "column" as const,
      gap: "0.5rem"
    },
    label: {
      color: "rgba(255, 255, 255, 0.8)",
      fontSize: "0.9rem",
      fontWeight: 500
    },
    input: {
      padding: "0.875rem 1rem",
      background: "rgba(255, 255, 255, 0.05)",
      border: "1px solid rgba(59, 130, 246, 0.3)",
      borderRadius: "8px",
      color: "rgba(255, 255, 255, 0.9)",
      fontSize: "0.95rem",
      transition: "all 0.3s ease",
      outline: "none"
    },
    errorBox: {
      padding: "0.875rem 1rem",
      background: "rgba(239, 68, 68, 0.1)",
      border: "1px solid rgba(239, 68, 68, 0.3)",
      borderRadius: "8px",
      color: "#fca5a5",
      fontSize: "0.9rem"
    },
    button: {
      padding: "0.875rem 1rem",
      background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
      color: "white",
      border: "none",
      borderRadius: "8px",
      fontSize: "1rem",
      fontWeight: 600,
      cursor: "pointer",
      transition: "all 0.3s ease",
      marginTop: "0.5rem"
    },
    footer: {
      marginTop: "1.5rem",
      textAlign: "center" as const,
      color: "rgba(255, 255, 255, 0.6)",
      fontSize: "0.9rem"
    },
    link: {
      color: "#3b82f6",
      textDecoration: "none",
      fontWeight: 600,
      transition: "color 0.3s ease"
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>🏢 HR Portal</h1>
          <p style={styles.subtitle}>Admin Dashboard</p>
        </div>

        {error && <div style={styles.errorBox}>⚠️ {error}</div>}

        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Username</label>
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <button 
            type="submit" 
            style={{
              ...styles.button,
              opacity: isLoading ? 0.6 : 1,
              cursor: isLoading ? "not-allowed" : "pointer"
            }}
            disabled={isLoading}
          >
            {isLoading ? "⏳ Signing in..." : "🔐 Sign In"}
          </button>
        </form>

        <div style={styles.footer}>
          Don't have an account?{" "}
          <Link 
            to="/register" 
            style={styles.link}
          >
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
