import Navbar from "./Navbar";


function Layout({ children }) {
  return (
    <div className="app-layout">
      <Navbar />

      <main className="main-content">
        {children}
      </main>

      <footer className="footer">
        <div className="footer-inner">
          <strong>School Event Planner</strong>

          <span>
            Platform kegiatan dan perlombaan sekolah.
          </span>
        </div>
      </footer>
    </div>
  );
}

export default Layout;