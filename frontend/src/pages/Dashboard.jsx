import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getEvents, getAnnouncements } from "../services/api";

function Dashboard() {
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [activeMenu, setActiveMenu] = useState("schedule");

  useEffect(() => {
    Promise.all([
      getEvents(),
      getAnnouncements(),
    ])
      .then(([eventsData, announcementsData]) => {
        setEvents(Array.isArray(eventsData) ? eventsData : []);
        setAnnouncements(
          Array.isArray(announcementsData)
            ? announcementsData
            : []
        );
      })
      .catch(() => {});
  }, []);

  function logout() {
    localStorage.removeItem("access_token");
    navigate("/");
  }

  return (
    <main className="dashboard-page">
      <header className="app-header dashboard-header">
        <Link to="/" className="brand">
          <span className="brand-mark">SE</span>

          <span className="brand-name">
            School Event
            <strong>Planner</strong>
          </span>
        </Link>

        <div className="header-actions">
          <button
            className="header-logout"
            onClick={logout}
          >
            Keluar
          </button>
        </div>
      </header>

      <div className="dashboard-shell">
        <section className="dashboard-hero">
          <div>
            <span className="eyebrow">
              DASHBOARD
            </span>

            <h1>
              Pusat <span>kegiatan.</span>
            </h1>

            <p>
              Kelola dan lihat seluruh informasi kegiatan
              sekolah.
            </p>
          </div>
        </section>

        <section className="stats-grid">
          <div className="stat-card accent">
            <span>KEGIATAN</span>
            <strong>{events.length}</strong>
            <small>Total kegiatan</small>
          </div>

          <div className="stat-card">
            <span>MENDATANG</span>
            <strong>
              {
                events.filter(
                  (event) => event.status === "upcoming"
                ).length
              }
            </strong>
            <small>Kegiatan mendatang</small>
          </div>

          <div className="stat-card">
            <span>PENGUMUMAN</span>
            <strong>{announcements.length}</strong>
            <small>Informasi terbaru</small>
          </div>

          <div className="stat-card">
            <span>STATUS</span>
            <strong className="active-text">AKTIF</strong>
            <small>Akun aktif</small>
          </div>
        </section>

        <section className="content-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">
                MENU UTAMA
              </span>

              <h2>
                Apa yang ingin kamu lihat?
              </h2>
            </div>
          </div>

          <div className="dashboard-menu">
            <button
              className={`dashboard-menu-item ${
                activeMenu === "schedule" ? "active" : ""
              }`}
              onClick={() => setActiveMenu("schedule")}
            >
              <strong>01</strong>
              <span>Jadwal Acara</span>
              <small>Lihat jadwal kegiatan</small>
            </button>

            <button
              className={`dashboard-menu-item ${
                activeMenu === "events" ? "active" : ""
              }`}
              onClick={() => setActiveMenu("events")}
            >
              <strong>02</strong>
              <span>Daftar Lomba</span>
              <small>Pilih kegiatan yang ingin diikuti</small>
            </button>

            <button
              className={`dashboard-menu-item ${
                activeMenu === "locations" ? "active" : ""
              }`}
              onClick={() => setActiveMenu("locations")}
            >
              <strong>03</strong>
              <span>Lokasi</span>
              <small>Lihat lokasi kegiatan</small>
            </button>

            <button
              className={`dashboard-menu-item ${
                activeMenu === "participants" ? "active" : ""
              }`}
              onClick={() => setActiveMenu("participants")}
            >
              <strong>04</strong>
              <span>Peserta</span>
              <small>Lihat peserta kegiatan</small>
            </button>

            <button
              className={`dashboard-menu-item ${
                activeMenu === "announcements" ? "active" : ""
              }`}
              onClick={() => setActiveMenu("announcements")}
            >
              <strong>05</strong>
              <span>Pengumuman</span>
              <small>Informasi terbaru</small>
            </button>
          </div>
        </section>

        <section className="content-section">
          {activeMenu === "schedule" && (
            <>
              <div className="section-heading">
                <div>
                  <span className="eyebrow">JADWAL</span>
                  <h2>Jadwal acara</h2>
                </div>
              </div>

              <div className="registration-list">
                {events.length === 0 ? (
                  <div className="empty-card">
                    <h3>Belum ada jadwal</h3>
                    <p>
                      Jadwal kegiatan akan muncul di sini.
                    </p>
                  </div>
                ) : (
                  events.map((event) => (
                    <div
                      className="registration-card"
                      key={event.id}
                    >
                      <div className="date-tile">
                        <strong>{event.date}</strong>
                      </div>

                      <div className="registration-main">
                        <span className="tag">
                          KEGIATAN
                        </span>

                        <h3>{event.name}</h3>

                        <p>
                          {event.start_time} -{" "}
                          {event.end_time}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}

          {activeMenu === "events" && (
            <>
              <div className="section-heading">
                <div>
                  <span className="eyebrow">
                    DAFTAR LOMBA
                  </span>

                  <h2>
                    Pilih kegiatan
                  </h2>
                </div>

                <Link
                  to="/events"
                  className="inline-link"
                >
                  Lihat semua ↗
                </Link>
              </div>

              <div className="registration-list">
                {events.map((event) => (
                  <Link
                    key={event.id}
                    to={`/events/${event.id}`}
                    className="registration-card"
                  >
                    <div className="date-tile">
                      <strong>↗</strong>
                    </div>

                    <div className="registration-main">
                      <span className="tag">
                        {event.category === "team"
                          ? "TIM"
                          : "INDIVIDU"}
                      </span>

                      <h3>{event.name}</h3>

                      <p>{event.location}</p>
                    </div>

                    <span className="card-link">
                      Lihat
                    </span>
                  </Link>
                ))}
              </div>
            </>
          )}

          {activeMenu === "locations" && (
            <>
              <div className="section-heading">
                <div>
                  <span className="eyebrow">
                    LOKASI
                  </span>

                  <h2>
                    Lokasi kegiatan
                  </h2>
                </div>
              </div>

              <div className="registration-list">
                {events.map((event) => (
                  <div
                    className="registration-card"
                    key={event.id}
                  >
                    <div className="date-tile">
                      <strong>⌖</strong>
                    </div>

                    <div className="registration-main">
                      <span className="tag">
                        LOKASI
                      </span>

                      <h3>{event.name}</h3>

                      <p>{event.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeMenu === "participants" && (
            <div className="empty-card large">
              <div className="empty-icon">♙</div>

              <h3>Data peserta</h3>

              <p>
                Data peserta akan ditampilkan
                berdasarkan kegiatan yang dipilih.
              </p>
            </div>
          )}

          {activeMenu === "announcements" && (
            <>
              <div className="section-heading">
                <div>
                  <span className="eyebrow">
                    PENGUMUMAN
                  </span>

                  <h2>
                    Informasi terbaru
                  </h2>
                </div>

                <Link
                  to="/announcements"
                  className="inline-link"
                >
                  Lihat semua ↗
                </Link>
              </div>

              <div className="registration-list">
                {announcements.length === 0 ? (
                  <div className="empty-card">
                    <h3>
                      Belum ada pengumuman
                    </h3>

                    <p>
                      Pengumuman terbaru akan muncul
                      di sini.
                    </p>
                  </div>
                ) : (
                  announcements.map((item) => (
                    <article
                      key={item.id}
                      className="registration-card"
                    >
                      <div className="date-tile">
                        <strong>!</strong>
                      </div>

                      <div className="registration-main">
                        <span className="tag">
                          INFO
                        </span>

                        <h3>{item.title}</h3>

                        <p>
                          {item.content ||
                            item.message}
                        </p>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}

export default Dashboard;