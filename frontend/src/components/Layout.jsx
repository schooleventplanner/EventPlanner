import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

function Layout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>

      <footer className="footer">
        <div>
          <strong>School Event Planner</strong>
          <span>Platform kegiatan sekolah</span>
        </div>

        <span>© 2026</span>
      </footer>
    </>
  );
}

export default Layout;