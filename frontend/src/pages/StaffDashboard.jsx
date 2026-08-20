import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getEvents } from "../services/api";

function StaffDashboard() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("access_token");
  const role = localStorage.getItem("user_role");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    getEvents()
      .then((data) => setEvents(Array.isArray(data) ? data : []))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, [token, navigate]);

  if (!token) return null;

  return (
    <main className="page">
      <Navbar />

      <section className="page-container page-main">
        <div className="page-title">
          <span className="home-eyebrow">
            {role === "admin" ? "ADMIN" : "PANITIA"}
          </span>

          <h1>Kelola Kegiatan</h1>

          <p>
            Pantau kegiatan dan informasi acara sekolah.
          </p>
        </div>

        <div className="staff-stats">
          <div className="staff-stat">
            <span>TOTAL KEGIATAN</span>
            <strong>{events.length}</strong>
          </div>

          <div className="staff-stat accent">
            <span>AKTIF</span>
            <strong>
              {events.filter((e) => e.status !== "closed").length}
            </strong>
          </div>
        </div>

        <div className="content-section">
          <div className="section-heading">
            <div>
              <span className="home-eyebrow">DAFTAR</span>
              <h2>Kegiatan</h2>
            </div>

            <Link to="/events" className="btn btn-secondary">
              Lihat halaman peserta
            </Link>
          </div>

          {loading ? (
            <div className="home-state">
              <div className="home-spinner" />
              <strong>Memuat kegiatan...</strong>
            </div>
          ) : events.length === 0 ? (
            <div className="home-state">
              <h3>Belum ada kegiatan.</h3>
              <p>
                Buat kegiatan melalui fitur backend/admin
                yang tersedia.
              </p>
            </div>
          ) : (
            <div className="staff-event-list">
              {events.map((event, index) => (
                <div className="staff-event-card" key={event.id}>
                  <span className="staff-number">
                    #{String(index + 1).padStart(2, "0")}
                  </span>

                  <div className="staff-event-info">
                    <span className="home-tag">
                      {event.category === "team"
                        ? "TIM"
                        : "INDIVIDU"}
                    </span>

                    <h3>{event.name}</h3>

                    <p>
                      {event.date || "-"} ·{" "}
                      {event.location || "-"}
                    </p>
                  </div>

                  <strong className="staff-status">
                    {event.status || "upcoming"}
                  </strong>

                  <Link
                    to={`/events/${event.id}`}
                    className="btn btn-secondary"
                  >
                    Detail
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default StaffDashboard;