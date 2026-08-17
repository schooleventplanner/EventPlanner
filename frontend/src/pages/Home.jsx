import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getEvents } from "../services/api";
import "../styles/Home.css";

function Home() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isLoggedIn = Boolean(
    localStorage.getItem("access_token")
  );

  useEffect(() => {
    async function loadEvents() {
      try {
        const data = await getEvents();
        setEvents(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(
          err.message || "Gagal mengambil data kegiatan."
        );
      } finally {
        setLoading(false);
      }
    }

    loadEvents();
  }, []);

  const upcomingEvents = events
    .filter((event) => event.status === "upcoming")
    .slice(0, 3);

  return (
    <main className="home-page">
      {/* HEADER */}
      <header className="home-header">
        <div className="home-container home-header-inner">
          <Link to="/" className="home-brand">
            <span className="home-brand-mark">SE</span>

            <span className="home-brand-name">
              School Event
              <strong>Planner</strong>
            </span>
          </Link>

          <nav className="home-nav">
            <Link to="/events">
              Kegiatan
            </Link>

            {isLoggedIn ? (
              <Link
                to="/dashboard"
                className="home-nav-cta"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login">
                  Masuk
                </Link>

                <Link
                  to="/register"
                  className="home-nav-cta"
                >
                  Daftar
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="home-hero">
        <div className="home-container home-hero-grid">
          <div className="home-hero-content">
            <span className="home-eyebrow home-eyebrow-light">
              PLATFORM KEGIATAN SEKOLAH
            </span>

            <h1>
              Semua kegiatan.
              <br />
              <span>Satu tempat.</span>
            </h1>

            <p>
              Temukan lomba, lihat jadwal, daftar kegiatan, dan
              pantau pendaftaranmu dalam satu platform yang
              sederhana.
            </p>

            <div className="home-hero-actions">
              <Link
                to="/events"
                className="home-btn home-btn-white"
              >
                Jelajahi kegiatan
                <span>↗</span>
              </Link>

              {isLoggedIn ? (
                <Link
                  to="/dashboard"
                  className="home-btn home-btn-outline"
                >
                  Buka dashboard
                </Link>
              ) : (
                <Link
                  to="/register"
                  className="home-btn home-btn-outline"
                >
                  Buat akun
                </Link>
              )}
            </div>

            <div className="home-trust">
              <span className="home-pulse-dot" />
              Terbuka untuk seluruh peserta sekolah
            </div>
          </div>

          {/* HERO VISUAL */}
          <div className="home-hero-visual">
            <div className="home-orb home-orb-one" />
            <div className="home-orb home-orb-two" />

            <div className="home-event-poster">
              <div className="home-poster-top">
                <span>SE · 2026</span>
                <span className="home-poster-status">
                  AKTIF
                </span>
              </div>

              <div className="home-poster-day">
                17
              </div>

              <div className="home-poster-title">
                <span>AGUSTUS</span>

                <strong>
                  Semarak
                  <br />
                  Kegiatan Sekolah
                </strong>
              </div>

              <div className="home-poster-bottom">
                <span>Lomba & kegiatan</span>
                <span>2026 ↗</span>
              </div>
            </div>

            <div className="home-floating-card home-floating-events">
              <strong>
                {events.length || "—"}
              </strong>

              <span>
                kegiatan
                <br />
                tersedia
              </span>
            </div>

            <div className="home-floating-card home-floating-new">
              <span className="home-floating-plus">
                +
              </span>

              <div>
                <small>Kegiatan baru</small>
                <strong>Segera hadir</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="home-stats">
        <div className="home-container home-stats-grid">
          <div>
            <strong>{events.length}</strong>
            <span>Total kegiatan</span>
          </div>

          <div>
            <strong>
              {upcomingEvents.length}
            </strong>
            <span>Kegiatan mendatang</span>
          </div>

          <div>
            <strong>01</strong>
            <span>Platform terpusat</span>
          </div>

          <div>
            <strong>∞</strong>
            <span>Kesempatan ikut</span>
          </div>
        </div>
      </section>

      {/* EVENTS */}
      <section className="home-container home-events">
        <div className="home-section-heading">
          <div>
            <span className="home-eyebrow">
              KEGIATAN TERBARU
            </span>

            <h2>
              Temukan kegiatan yang menarik untukmu.
            </h2>
          </div>

          <Link
            to="/events"
            className="home-inline-link"
          >
            Lihat semua ↗
          </Link>
        </div>

        {loading && (
          <div className="home-state">
            <div className="home-spinner" />

            <strong>Memuat kegiatan</strong>

            <span>
              Menyiapkan kegiatan terbaru...
            </span>
          </div>
        )}

        {!loading && error && (
          <div className="home-state home-state-error">
            <span className="home-eyebrow">
              ERROR
            </span>

            <h3>Gagal memuat kegiatan.</h3>

            <p>{error}</p>
          </div>
        )}

        {!loading &&
          !error &&
          upcomingEvents.length === 0 && (
            <div className="home-state">
              <span className="home-eyebrow">
                BELUM TERSEDIA
              </span>

              <h3>
                Belum ada kegiatan mendatang.
              </h3>

              <p>
                Kegiatan baru akan muncul di sini ketika
                tersedia.
              </p>
            </div>
          )}

        {!loading &&
          !error &&
          upcomingEvents.length > 0 && (
            <div className="home-event-grid">
              {upcomingEvents.map((event, index) => (
                <Link
                  key={event.id}
                  to={`/events/${event.id}`}
                  className="home-event-card"
                >
                  <div className="home-event-card-top">
                    <span className="home-tag">
                      {event.category === "team"
                        ? "TIM"
                        : "INDIVIDU"}
                    </span>

                    <span className="home-event-arrow">
                      ↗
                    </span>
                  </div>

                  <span className="home-event-index">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <h3>{event.name}</h3>

                  <p>{event.description}</p>

                  <div className="home-event-footer">
                    <span>{event.date}</span>
                    <span>{event.location}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
      </section>

      {/* CTA */}
      <section className="home-cta">
        <div className="home-container home-cta-inner">
          <div>
            <span className="home-eyebrow home-eyebrow-light">
              SIAP IKUT BERPARTISIPASI?
            </span>

            <h2>
              Kegiatan berikutnya
              <br />
              menunggumu.
            </h2>
          </div>

          <Link
            to="/events"
            className="home-cta-button"
          >
            <span>Jelajahi kegiatan</span>
            <strong>↗</strong>
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="home-footer">
        <div className="home-container home-footer-inner">
          <div className="home-footer-brand">
            <span className="home-brand-mark">
              SE
            </span>

            <div>
              <strong>
                School Event Planner
              </strong>

              <span>
                Platform kegiatan sekolah
              </span>
            </div>
          </div>

          <span>
            © 2026 School Event Planner
          </span>
        </div>
      </footer>
    </main>
  );
}

export default Home;