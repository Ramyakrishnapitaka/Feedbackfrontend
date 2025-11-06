import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("http://localhost:4500/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      setMessage(data.message || "");

      if (res.status === 409) {
        setMessage("User already exists. Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000);
      } else if (res.ok) {
        alert("Signup successful! Please log in to continue.");
        setForm({ name: "", email: "", password: "" });

        navigate("/login");
      }
    } catch (err) {
      console.error("Signup error:", err);
      setMessage("Network error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="auth-container"
      style={{
        maxWidth: "400px",
        margin: "50px auto",
        padding: "20px",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        borderRadius: "10px",
        textAlign: "center",
      }}
    >
      <h2 style={{ color: "#007bff", marginBottom: "20px" }}>Create Account</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="name"
          type="text"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          required
          className="form-control mb-3"
          style={{ padding: "10px", borderRadius: "8px", border: "1px solid #ccc", width: "100%" }}
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="form-control mb-3"
          style={{ padding: "10px", borderRadius: "8px", border: "1px solid #ccc", width: "100%" }}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          className="form-control mb-3"
          style={{ padding: "10px", borderRadius: "8px", border: "1px solid #ccc", width: "100%" }}
        />

        <button
          type="submit"
          className="btn btn-primary w-100"
          disabled={loading}
          style={{
            padding: "10px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            width: "100%",
          }}
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </button>
      </form>
      {message && (
        <p
          style={{
            marginTop: "15px",
            color: message.toLowerCase().includes("exist")
              ? "red"
              : "green",
          }}
        >
          {message}
        </p>
      )}

      <p style={{ marginTop: "10px" }}>
        Already have an account?{" "}
        <Link to="/login" style={{ color: "#007bff" }}>
          Log in
        </Link>
      </p>
    </div>
  );
}
