import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Announcements.css";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8000";

function formatDate(isoString) {
  if (!isoString) return "";

  try {
    return new Date(isoString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return isoString;
  }
}

function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadAnnouncements() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/announcements`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.detail || "Gagal mengambil pengumuman."
          );
        }

        setAnnouncements(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(
          err.message || "Gagal mengambil pengumuman."
        );
      } finally {
        setLoading(false);
      }
    }

    loadAnnouncements();
  }, []);

  return (
    <main className="announcements-page">
      <header className="announcements-header">
        <div className="announcements-container announcements-header-inner">
          <Link to="/" className="announcements-brand">
            <span className="announcements-brand-mark">SE</span>

            <span className="announcements-brand-name">
              School Event
              <strong>Planner</strong>
            </span>
          </Link>

          <nav className="announcements-nav">
            <Link to="/" className="announcements-nav-link">
              Beranda
            </Link>

            <Link to="/events" className="announcements-nav-link">
              Kegiatan
            </Link>

            <Link
              to="/announcements"
              className="announcements-nav-link active"
            >
              Pengumuman
            </Link>

            <Link to="/login" className="announcements-nav-link">
              Masuk
            </Link>

            <Link
              to="/register"
              className="announcements-nav-button"
            >
              Daftar
            </Link>
          </nav>
        </div>
      </header>

      <section className="announcements-hero">
        <div className="announcements-container">
          <span className="announcements-eyebrow">
            INFORMASI TERBARU
          </span>

          <h1>
            Pengumuman
            <span> kegiatan sekolah.</span>
          </h1>

          <p>
            Ikuti kabar terbaru seputar kegiatan, jadwal, dan
            perubahan penting dari panitia.
          </p>
        </div>
      </section>

      <section className="announcements-content">
        <div className="announcements-container">
          {loading && (
            <div className="announcements-state">
              <div className="announcements-spinner" />
              <strong>Memuat pengumuman</strong>
              <span>Menyiapkan informasi terbaru...</span>
            </div>
          )}

          {!loading && error && (
            <div className="announcements-state error">
              <span className="announcements-state-label">
                ERROR
              </span>
              <strong>Pengumuman gagal dimuat.</strong>
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && announcements.length === 0 && (
            <div className="announcements-state empty">
              <div className="announcements-empty-icon">—</div>
              <span className="announcements-state-label">
                BELUM ADA PENGUMUMAN
              </span>
              <strong>Belum ada pengumuman saat ini.</strong>
              <p>Pengumuman baru akan muncul di sini ketika tersedia.</p>
            </div>
          )}

          {!loading && !error && announcements.length > 0 && (
            <div className="announcements-list">
              {announcements.map((item, index) => (
                <article className="announcement-card" key={item.id}>
                  <div className="announcement-number">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <div className="announcement-main">
                    <span className="announcement-date">
                      {formatDate(item.created_at)}
                    </span>

                    <h2>{item.title}</h2>

                    <p>{item.content}</p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <footer className="announcements-footer">
        <div className="announcements-container announcements-footer-inner">
          <div>
            <strong>School Event Planner</strong>
            <span>Platform kegiatan sekolah</span>
          </div>

          <span>© 2026 School Event Planner</span>
        </div>
      </footer>
    </main>
  );
}

export default Announcements;