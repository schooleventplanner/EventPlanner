import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getEvents } from "../services/api";
import "../styles/Events.css";

function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  const token = localStorage.getItem("access_token");

  let user = null;

  try {
    user = JSON.parse(
      localStorage.getItem("user") || "null"
    );
  } catch {
    user = null;
  }

  const isLoggedIn = Boolean(token);

  const isCommittee =
    user?.role === "committee" ||
    user?.role === "staff";

  const dashboardPath = isCommittee
    ? "/staff"
    : "/dashboard";

  const dashboardLabel = isCommittee
    ? "Panel Panitia"
    : "Dashboard";

  useEffect(() => {
    async function loadEvents() {
      try {
        setLoading(true);
        setError("");

        const data = await getEvents();

        setEvents(
          Array.isArray(data) ? data : []
        );
      } catch (err) {
        setError(
          err.message ||
            "Gagal mengambil kegiatan."
        );
      } finally {
        setLoading(false);
      }
    }

    loadEvents();
  }, []);

  const filteredEvents = events.filter(
    (event) => {
      if (filter === "all") {
        return true;
      }

      return event.category === filter;
    }
  );

  return (
    <main className="page events-page">
      {/* HEADER */}
      <header className="events-header">
        <div className="events-container events-header-inner">
          <Link
            to="/"
            className="events-brand"
          >
            <span className="events-brand-mark">
              SE
            </span>

            <span className="events-brand-name">
              School Event
              <strong>Planner</strong>
            </span>
          </Link>

          <nav className="events-nav">
            <Link
              to="/events"
              className="active"
            >
              Kegiatan
            </Link>

            {isLoggedIn ? (
              <Link
                to={dashboardPath}
                className="events-nav-cta"
              >
                {dashboardLabel}
              </Link>
            ) : (
              <>
                <Link to="/login">
                  Masuk
                </Link>

                <Link
                  to="/register"
                  className="events-nav-cta"
                >
                  Daftar
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="events-hero">
        <div className="events-container events-hero-grid">
          <div>
            <span className="events-eyebrow events-eyebrow-light">
              SCHOOL EVENTS 2026
            </span>

            <h1>
              Temukan kegiatan
              <br />
              <span>untukmu.</span>
            </h1>

            <p>
              Jelajahi berbagai lomba dan kegiatan
              sekolah yang tersedia. Pilih yang kamu
              suka, lalu daftar dalam beberapa langkah.
            </p>
          </div>

          <div className="events-hero-counter">
            <strong>
              {events.length}
            </strong>

            <span>
              kegiatan
              <br />
              tersedia
            </span>
          </div>
        </div>
      </section>

      {/* EVENTS BROWSER */}
      <section className="events-container events-browser">
        <div className="events-section-heading">
          <div>
            <span className="events-eyebrow">
              EXPLORE
            </span>

            <h2>
              Semua kegiatan
            </h2>
          </div>

          <div className="events-filter-group">
            {[
              ["all", "Semua"],
              ["individual", "Individu"],
              ["team", "Tim"],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                className={
                  filter === value
                    ? "events-filter active"
                    : "events-filter"
                }
                onClick={() =>
                  setFilter(value)
                }
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="events-state">
            <div className="events-spinner" />

            <strong>
              Memuat kegiatan
            </strong>

            <span>
              Menyiapkan daftar kegiatan...
            </span>
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className="events-state events-state-error">
            <span className="events-eyebrow">
              ERROR
            </span>

            <h3>
              Data kegiatan gagal dimuat.
            </h3>

            <p>
              {error}
            </p>
          </div>
        )}

        {/* EMPTY */}
        {!loading &&
          !error &&
          filteredEvents.length === 0 && (
            <div className="events-state events-state-empty">
              <div className="events-empty-icon">
                —
              </div>

              <span className="events-eyebrow">
                TIDAK ADA DATA
              </span>

              <h3>
                Tidak ada kegiatan pada filter ini.
              </h3>

              <p>
                Coba pilih kategori lainnya.
              </p>
            </div>
          )}

        {/* EVENTS */}
        {!loading &&
          !error &&
          filteredEvents.length > 0 && (
            <div className="events-grid">
              {filteredEvents.map(
                (event, index) => (
                  <Link
                    key={event.id}
                    to={`/events/${event.id}`}
                    className="events-card"
                  >
                    <div className="events-card-top">
                      <span className="events-tag">
                        {event.category === "team"
                          ? "TIM"
                          : "INDIVIDU"}
                      </span>

                      <span className="events-number">
                        {String(index + 1).padStart(
                          2,
                          "0"
                        )}
                      </span>
                    </div>

                    <div className="events-card-body">
                      <h3>
                        {event.name}
                      </h3>

                      <p>
                        {event.description}
                      </p>
                    </div>

                    <div className="events-meta">
                      <div>
                        <span>
                          TANGGAL
                        </span>

                        <strong>
                          {event.date}
                        </strong>
                      </div>

                      <div>
                        <span>
                          WAKTU
                        </span>

                        <strong>
                          {event.start_time}
                          {" – "}
                          {event.end_time}
                        </strong>
                      </div>

                      <div>
                        <span>
                          LOKASI
                        </span>

                        <strong>
                          {event.location}
                        </strong>
                      </div>
                    </div>

                    <div className="events-card-arrow">
                      ↗
                    </div>
                  </Link>
                )
              )}
            </div>
          )}
      </section>
    </main>
  );
}

export default Events;