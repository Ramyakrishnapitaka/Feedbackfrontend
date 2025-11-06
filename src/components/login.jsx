import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const loginForm = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email").required("Required"),
      password: Yup.string().min(6, "Min 6 chars").required("Required"),
    }),
    onSubmit: (values) => {
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const user = users.find(u => u.email === values.email);

      if (!user) {
        alert("Registration Required!");
        navigate("/signup");
      } else if (user.password !== values.password) {
        alert("Invalid password!");
      } else {
        localStorage.setItem("loggedInUser", JSON.stringify(user)); 
        window.dispatchEvent(new Event("storage")); 
        navigate("/user");
      }
    },
  });

  return (
    <div className="form-container" style={{ maxWidth: "400px", margin: "50px auto", padding: "30px", border: "1px solid #ddd", borderRadius: "12px", background: "#fff" }}>
      <h2 className="text-center mb-4">Login</h2>
      <form onSubmit={loginForm.handleSubmit} className="d-flex flex-column gap-3">
        <input type="email" name="email" placeholder="Email" className="form-control" {...loginForm.getFieldProps("email")} />
        {loginForm.touched.email && loginForm.errors.email && <div className="text-danger">{loginForm.errors.email}</div>}

        <input type="password" name="password" placeholder="Password" className="form-control" {...loginForm.getFieldProps("password")} />
        {loginForm.touched.password && loginForm.errors.password && <div className="text-danger">{loginForm.errors.password}</div>}

        <button type="submit" className="btn btn-primary mt-2">Login</button>
        <p className="mt-2 text-center">Don't have an account? <a href="/signup">Signup here</a></p>
      </form>
    </div>
  );
}

export default Login