import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();

  const signupForm = useFormik({
    initialValues: { name: "", email: "", password: "" },
    validationSchema: Yup.object({
      name: Yup.string()
        .min(2, "Name must be at least 2 characters")
        .required("Name is required"),
      email: Yup.string()
        .email("Invalid email")
        .required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    }),
    onSubmit: (values) => {
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const existing = users.find(u => u.email === values.email);

      if (existing) {
        alert("User already exists!");
      } else {
        users.push(values);
        localStorage.setItem("users", JSON.stringify(users));
        alert("Signup successful!");
        navigate("/login");
      }
    },
  });

  return (
    <div className="form-wrapper">
      <div className="form-container">
        <h2>Signup</h2>
        <form onSubmit={signupForm.handleSubmit} className="d-flex flex-column gap-3">
          <input
            name="name"
            placeholder="Name"
            value={signupForm.values.name}
            onChange={signupForm.handleChange}
            onBlur={signupForm.handleBlur}
            className="form-control"
          />
          {signupForm.touched.name && signupForm.errors.name && (
            <div className="error-message">{signupForm.errors.name}</div>
          )}

          <input
            name="email"
            placeholder="Email"
            value={signupForm.values.email}
            onChange={signupForm.handleChange}
            onBlur={signupForm.handleBlur}
            className="form-control"
          />
          {signupForm.touched.email && signupForm.errors.email && (
            <div className="error-message">{signupForm.errors.email}</div>
          )}

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={signupForm.values.password}
            onChange={signupForm.handleChange}
            onBlur={signupForm.handleBlur}
            className="form-control"
          />
          {signupForm.touched.password && signupForm.errors.password && (
            <div className="error-message">{signupForm.errors.password}</div>
          )}

          <button type="submit" className="btn btn-primary">Signup</button>
          <p className="text-center mt-2">
            Already registered? <a href="/login">Login here</a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Signup;
