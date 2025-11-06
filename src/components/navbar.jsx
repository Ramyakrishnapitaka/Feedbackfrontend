import { Link, Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../App.css";

function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const checkUser = () => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    setUser(loggedInUser);
  };

  useEffect(() => {
    checkUser();
    window.addEventListener("storage", checkUser); 
    return () => window.removeEventListener("storage", checkUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    setUser(null);
    navigate("/login");
    window.dispatchEvent(new Event("storage")); 
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
        <div className="container-fluid">
          <Link className="navbar-brand fw-bold" to="/">Respondify</Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              {!user ? (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/login">Login</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/signup">Signup</Link>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/user">User</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/admin">Admin</Link>
                  </li>
                  <li className="nav-item">
                    <button className="btn btn-link nav-link" onClick={handleLogout}>Logout</button>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>

      <div className="main-content">
        <Outlet />
      </div>
    </>
  );
}

export default Navbar;
