import { NavLink, Link } from "react-router-dom";


function Navbar() {
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

          <NavLink to="/events">
            Lomba
          </NavLink>

          <NavLink to="/announcements">
            Pengumuman
          </NavLink>
        </nav>

        <div className="navbar-actions">
          <Link
            to="/login"
            className="navbar-login"
          >
            Masuk
          </Link>

          <Link
            to="/register"
            className="navbar-register"
          >
            Daftar
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Navbar;