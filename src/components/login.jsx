

import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const loginForm = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email").required("Required"),
      password: Yup.string().min(6, "Minimum 6 characters").required("Required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:4500/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });

        const data = await res.json();

        if (res.status === 404 || data.message === "User not found") {
          alert("User not registered! Redirecting to signup...");
          return navigate("/signup");
        }

        if (!res.ok) return alert(data.message);

        localStorage.setItem("loggedInUser", JSON.stringify(data.user));
        window.dispatchEvent(new Event("storage"));

        data.user.role === "admin" ? navigate("/admin") : navigate("/user");
      } catch (err) {
        console.error(err);
        alert("Server error! Try again later.");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div style={{ maxWidth: "400px", margin: "60px auto", padding: "25px", borderRadius: "12px", boxShadow: "0 0 12px rgba(0,0,0,0.1)", backgroundColor: "#fff", textAlign: "center" }}>
      <h2 style={{ color: "#007bff", marginBottom: "20px" }}>Login</h2>
      <form onSubmit={loginForm.handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <input type="email" placeholder="Email" {...loginForm.getFieldProps("email")} style={{ padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }} />
        {loginForm.touched.email && loginForm.errors.email && <div style={{ color: "red" }}>{loginForm.errors.email}</div>}

        <input type="password" placeholder="Password" {...loginForm.getFieldProps("password")} style={{ padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }} />
        {loginForm.touched.password && loginForm.errors.password && <div style={{ color: "red" }}>{loginForm.errors.password}</div>}

        <button type="submit" disabled={loading} style={{ padding: "10px", borderRadius: "8px", backgroundColor: "#007bff", color: "#fff" }}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <p style={{ marginTop: "15px" }}>
        Don’t have an account? <Link to="/signup" style={{ color: "#007bff" }}>Sign up here</Link>
      </p>
    </div>
  );
}
