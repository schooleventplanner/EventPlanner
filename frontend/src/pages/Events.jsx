import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getEvents } from "../services/api";

function Events() {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEvents()
      .then((data) => setEvents(Array.isArray(data) ? data : []))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered =
    filter === "all"
      ? events
      : events.filter((event) => event.category === filter);

  return (
    <main className="page">
      <Navbar />

      <section className="events-hero">
        <div className="page-container">
          <span className="home-eyebrow home-eyebrow-light">
            KEGIATAN SEKOLAH
          </span>

          <h1>Jadwal & Lomba</h1>

          <p>
            Lihat semua kegiatan yang tersedia dan pilih
            lomba yang ingin kamu ikuti.
          </p>
        </div>
      </section>

      <section className="page-container page-main">
        <div className="filter-group">
          <button
            className={`filter ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            Semua
          </button>

          <button
            className={`filter ${filter === "individual" ? "active" : ""}`}
            onClick={() => setFilter("individual")}
          >
            Individu
          </button>

          <button
            className={`filter ${filter === "team" ? "active" : ""}`}
            onClick={() => setFilter("team")}
          >
            Tim
          </button>
        </div>

        {loading ? (
          <div className="home-state">
            <div className="home-spinner" />
            <strong>Memuat kegiatan...</strong>
          </div>
        ) : filtered.length === 0 ? (
          <div className="home-state">
            <h3>Belum ada kegiatan.</h3>
            <p>Kegiatan akan tampil setelah dibuat oleh panitia.</p>
          </div>
        ) : (
          <div className="event-grid">
            {filtered.map((event, index) => (
              <Link
                key={event.id}
                to={`/events/${event.id}`}
                className="event-card"
              >
                <div className="event-card-top">
                  <span className="home-tag">
                    {event.category === "team" ? "TIM" : "INDIVIDU"}
                  </span>

                  <span className="event-number">
                    #{String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <div className="event-card-body">
                  <h3>{event.name}</h3>

                  <p>
                    {event.description ||
                      "Informasi kegiatan sekolah."}
                  </p>
                </div>

                <div className="event-meta">
                  <div>
                    <span>TANGGAL</span>
                    <strong>{event.date || "-"}</strong>
                  </div>

                  <div>
                    <span>LOKASI</span>
                    <strong>{event.location || "-"}</strong>
                  </div>

                  <div>
                    <span>STATUS</span>
                    <strong>{event.status || "upcoming"}</strong>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default Events;