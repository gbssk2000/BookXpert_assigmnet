import { useState } from "react";
import { register } from "./AuthService";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    if (!username || !email || !password || !confirmPassword) {
      setError("All fields are required");
      return false;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    if (!email.includes("@")) {
      setError("Please enter a valid email");
      return false;
    }
    return true;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await register({ username, email, password });
      setSuccess("✅ Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/"), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
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
      maxWidth: "450px",
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
    successBox: {
      padding: "0.875rem 1rem",
      background: "rgba(16, 185, 129, 0.1)",
      border: "1px solid rgba(16, 185, 129, 0.3)",
      borderRadius: "8px",
      color: "#86efac",
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
    },
    passwordHint: {
      fontSize: "0.8rem",
      color: "rgba(255, 255, 255, 0.5)",
      marginTop: "0.25rem"
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>🏢 HR Portal</h1>
          <p style={styles.subtitle}>Create Your Account</p>
        </div>

        {error && <div style={styles.errorBox}>⚠️ {error}</div>}
        {success && <div style={styles.successBox}>{success}</div>}

        <form onSubmit={handleRegister} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Username</label>
            <input
              type="text"
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              placeholder="Create a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              required
            />
            <p style={styles.passwordHint}>Minimum 6 characters</p>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Confirm Password</label>
            <input
              type="password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
            {isLoading ? "⏳ Creating account..." : "✨ Create Account"}
          </button>
        </form>

        <div style={styles.footer}>
          Already have an account?{" "}
          <Link 
            to="/" 
            style={styles.link}
          >
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
