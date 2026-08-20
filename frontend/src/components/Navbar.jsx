import { Link, NavLink, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");
  const role = localStorage.getItem("user_role");

  function logout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_role");
    localStorage.removeItem("user");
    navigate("/");
  }

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <span className="brand-mark">SE</span>

          <span>
            <strong>School Event</strong>
            <small>Planner</small>
          </span>
        </Link>

        <nav className="navbar-links">
          <NavLink to="/">Beranda</NavLink>
          <NavLink to="/events">Lomba</NavLink>
          <NavLink to="/announcements">Pengumuman</NavLink>

          {token && (
            <NavLink to={role === "staff" || role === "admin" ? "/staff" : "/dashboard"}>
              Dashboard
            </NavLink>
          )}
        </nav>

        <div className="navbar-actions">
          {token ? (
            <button className="navbar-login" onClick={logout}>
              Keluar
            </button>
          ) : (
            <>
              <Link to="/login" className="navbar-login">
                Masuk
              </Link>

              <Link to="/register" className="navbar-register">
                Daftar
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;