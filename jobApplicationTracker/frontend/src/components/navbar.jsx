import { Link, useLocation, useNavigate } from "react-router-dom";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  // Don't show navbar on login page
  if (location.pathname === "/login" || !token) {
    return null;
  }

  function logout() {
    localStorage.removeItem("token");

    navigate("/login");
  }

  return (
    <header className="navbar">
      <div className="navbar-left">
        <Link to="/dashboard" className="brand">
          <div className="brand-icon">JT</div>

          <span>JobTracker</span>
        </Link>
      </div>

      <nav className="nav-links">
        <Link
          to="/dashboard"
          className={
            location.pathname === "/dashboard" ? "nav-link active" : "nav-link"
          }
        >
          Dashboard
        </Link>

        <Link
          to="/applications"
          className={
            location.pathname.startsWith("/applications")
              ? "nav-link active"
              : "nav-link"
          }
        >
          Applications
        </Link>
        <Link
          to="/companies"
          className={
            location.pathname.startsWith("/companies")
              ? "nav-link active"
              : "nav-link"
          }
        >
          Companies
        </Link>

        
        <Link
          to="/job-listings"
          className={
            location.pathname.startsWith("/job-listings")
              ? "nav-link active"
              : "nav-link"
          }
        >
          Saved Jobs
        </Link>
        <Link
          to="/profile"
          className={
            location.pathname === "/profile" ? "nav-link active" : "nav-link"
          }
        >
          Profile
        </Link>
        <Link to="/reminders">Reminders</Link>
      </nav>

      <div className="navbar-right">
        <div className="user-avatar">U</div>

        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>
    </header>
  );
}

export default Navbar;
