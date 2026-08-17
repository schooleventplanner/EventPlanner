import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8000";

function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      const token = localStorage.getItem("access_token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [userResponse, registrationsResponse] =
          await Promise.all([
            fetch(`${API_URL}/auth/me`, { headers }),
            fetch(`${API_URL}/registrations/me`, { headers }),
          ]);

        const userData = await userResponse.json();
        const registrationData =
          await registrationsResponse.json();

        if (!userResponse.ok) {
          throw new Error(
            userData.detail || "Sesi login tidak valid."
          );
        }

        setUser(userData);

        if (registrationsResponse.ok) {
          setRegistrations(
            Array.isArray(registrationData)
              ? registrationData
              : registrationData.registrations || []
          );
        }
      } catch (err) {
        setError(
          err.message || "Gagal mengambil data dashboard."
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [navigate]);

  function handleLogout() {
    localStorage.removeItem("access_token");
    navigate("/login");
  }

  if (loading) {
    return (
      <main className="dashboard-page">
        <div className="dashboard-state">
          <div className="dashboard-spinner" />
          <strong>Memuat dashboard</strong>
          <span>Menyiapkan data akunmu...</span>
        </div>
      </main>
    );
  }

  const approvedCount = registrations.filter(
    (item) => item.status === "approved"
  ).length;

  const pendingCount = registrations.filter(
    (item) => item.status === "pending"
  ).length;

  return (
    <main className="dashboard-page">
      <header className="dashboard-header">
        <div className="dashboard-header-inner">
          <Link to="/" className="dashboard-brand">
            <span className="dashboard-brand-mark">SE</span>

            <span>
              <strong>School Event</strong>
              <small>Planner</small>
            </span>
          </Link>

          <nav className="dashboard-nav">
            <Link to="/events">Kegiatan</Link>

            <button
              type="button"
              onClick={handleLogout}
              className="dashboard-logout"
            >
              Keluar
            </button>
          </nav>
        </div>
      </header>

      <section className="dashboard-shell">
        <div className="dashboard-hero">
          <div>
            <span className="dashboard-eyebrow">
              PESERTA
            </span>

            <h1>
              Halo,{" "}
              <span>
                {user?.name || "Peserta"}
              </span>
            </h1>

            <p>
              Pantau kegiatan dan pendaftaranmu di sini.
            </p>
          </div>

          <div className="dashboard-profile">
            <div className="dashboard-avatar">
              {(user?.name || "P")
                .charAt(0)
                .toUpperCase()}
            </div>

            <div>
              <strong>
                {user?.name || "Peserta"}
              </strong>
              <span>
                {user?.email || "-"}
              </span>
            </div>
          </div>
        </div>

        {error && (
          <div className="dashboard-alert">
            <strong>!</strong>
            <span>{error}</span>
          </div>
        )}

        <div className="dashboard-stats">
          <div className="dashboard-stat dashboard-stat-accent">
            <span>TOTAL PENDAFTARAN</span>
            <strong>{registrations.length}</strong>
            <small>Kegiatan yang kamu ikuti</small>
          </div>

          <div className="dashboard-stat">
            <span>DISETUJUI</span>
            <strong>{approvedCount}</strong>
            <small>Pendaftaran diterima</small>
          </div>

          <div className="dashboard-stat">
            <span>MENUNGGU</span>
            <strong>{pendingCount}</strong>
            <small>Masih dalam proses</small>
          </div>

          <div className="dashboard-stat">
            <span>STATUS</span>
            <strong className="dashboard-active">
              AKTIF
            </strong>
            <small>Akun peserta</small>
          </div>
        </div>

        <section className="dashboard-section">
          <div className="dashboard-section-heading">
            <div>
              <span className="dashboard-eyebrow">
                AKTIVITAS
              </span>
              <h2>Pendaftaran saya</h2>
            </div>

            <Link to="/events">
              Jelajahi kegiatan ↗
            </Link>
          </div>

          {registrations.length === 0 ? (
            <div className="dashboard-empty">
              <div className="dashboard-empty-icon">
                +
              </div>

              <span className="dashboard-eyebrow">
                BELUM ADA PENDAFTARAN
              </span>

              <h3>
                Kamu belum mengikuti kegiatan.
              </h3>

              <p>
                Jelajahi kegiatan sekolah dan temukan
                sesuatu yang menarik untuk diikuti.
              </p>

              <Link
                to="/events"
                className="dashboard-primary-button"
              >
                Lihat kegiatan
              </Link>
            </div>
          ) : (
            <div className="registration-list">
              {registrations.map((registration, index) => {
                const event =
                  registration.event || registration;

                const status =
                  registration.status || "pending";

                return (
                  <article
                    key={
                      registration.id ||
                      registration.event_id ||
                      index
                    }
                    className="registration-card"
                  >
                    <div className="registration-number">
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    <div className="registration-main">
                      <span className="registration-category">
                        {event.category === "team"
                          ? "TIM"
                          : "INDIVIDU"}
                      </span>

                      <h3>
                        {event.name ||
                          registration.event_name ||
                          "Kegiatan"}
                      </h3>

                      <p>
                        {event.date ||
                          registration.date ||
                          "Tanggal belum tersedia"}
                      </p>
                    </div>

                    <span
                      className={`registration-status ${status}`}
                    >
                      {status === "approved"
                        ? "Disetujui"
                        : status === "pending"
                          ? "Menunggu"
                          : status === "closed"
                            ? "Ditutup"
                            : status}
                    </span>

                    {event.id && (
                      <Link
                        to={`/events/${event.id}`}
                        className="registration-link"
                      >
                        Detail ↗
                      </Link>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </section>

      <footer className="dashboard-footer">
        <div>
          <strong>School Event Planner</strong>
          <span>
            Platform kegiatan dan perlombaan sekolah.
          </span>
        </div>

        <span>&copy; 2026</span>
      </footer>
    </main>
  );
}

export default Dashboard;