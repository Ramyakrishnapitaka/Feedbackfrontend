import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Signup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const signupForm = useFormik({
    initialValues: { name: "", email: "", password: "", role: "user" },
    validationSchema: Yup.object({
      name: Yup.string().min(2, "Min 2 chars").required("Required"),
      email: Yup.string().email("Invalid email").required("Required"),
      password: Yup.string().min(6, "Min 6 chars").required("Required"),
      role: Yup.string().oneOf(["user", "admin"]).required("Required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:4500/api/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });

        const data = await res.json();

        if (res.status === 409 || data.message === "User already exists") {
          alert("User already exists! Redirecting to login...");
          return navigate("/login");
        }

        if (!res.ok) return alert(data.message);

        alert(data.message);
        navigate("/login");
      } catch (err) {
        console.error(err);
        alert("Server error! Try again later.");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", padding: "25px", borderRadius: "12px", boxShadow: "0 0 12px rgba(0,0,0,0.1)", backgroundColor: "#fff" }}>
      <h2 style={{ color: "#007bff", textAlign: "center", marginBottom: "20px" }}>Signup</h2>
      <form onSubmit={signupForm.handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <input name="name" placeholder="Name" {...signupForm.getFieldProps("name")} style={{ padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }} />
        {signupForm.touched.name && signupForm.errors.name && <div style={{ color: "red" }}>{signupForm.errors.name}</div>}

        <input name="email" placeholder="Email" {...signupForm.getFieldProps("email")} style={{ padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }} />
        {signupForm.touched.email && signupForm.errors.email && <div style={{ color: "red" }}>{signupForm.errors.email}</div>}

        <input name="password" type="password" placeholder="Password" {...signupForm.getFieldProps("password")} style={{ padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }} />
        {signupForm.touched.password && signupForm.errors.password && <div style={{ color: "red" }}>{signupForm.errors.password}</div>}

        <select name="role" {...signupForm.getFieldProps("role")} style={{ padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <button type="submit" disabled={loading} style={{ padding: "10px", borderRadius: "8px", backgroundColor: "#007bff", color: "#fff" }}>
          {loading ? "Signing up..." : "Signup"}
        </button>
      </form>
    </div>
  );
}


