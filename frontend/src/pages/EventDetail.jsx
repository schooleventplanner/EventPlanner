import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getEvent, registerEvent } from "../services/api";
import "../styles/EventDetail.css";

function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [registering, setRegistering] = useState(false);
  const [success, setSuccess] = useState("");

  const isLoggedIn = Boolean(
    localStorage.getItem("access_token")
  );

  useEffect(() => {
    async function loadEvent() {
      try {
        setLoading(true);
        setError("");

        const data = await getEvent(id);
        setEvent(data);
      } catch (err) {
        setError(
          err.message || "Gagal mengambil detail kegiatan."
        );
      } finally {
        setLoading(false);
      }
    }

    loadEvent();
  }, [id]);

  async function handleRegister() {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    try {
      setRegistering(true);
      setError("");
      setSuccess("");

      await registerEvent(id);

      setSuccess("Pendaftaran kegiatan berhasil.");
    } catch (err) {
      if (err.message === "LOGIN_REQUIRED") {
        navigate("/login");
        return;
      }

      setError(
        err.message || "Gagal mendaftar kegiatan."
      );
    } finally {
      setRegistering(false);
    }
  }

  if (loading) {
    return (
      <main className="event-detail-page">
        <header className="detail-header">
          <div className="detail-container detail-header-inner">
            <Link to="/" className="detail-brand">
              <span className="detail-brand-mark">SE</span>

              <span className="detail-brand-name">
                School Event
                <strong>Planner</strong>
              </span>
            </Link>

            <Link to="/events" className="detail-back">
              ← Kembali
            </Link>
          </div>
        </header>

        <div className="detail-state">
          <div className="detail-spinner" />
          <strong>Memuat kegiatan</strong>
          <span>Menyiapkan detail kegiatan...</span>
        </div>
      </main>
    );
  }

  if (error && !event) {
    return (
      <main className="event-detail-page">
        <header className="detail-header">
          <div className="detail-container detail-header-inner">
            <Link to="/" className="detail-brand">
              <span className="detail-brand-mark">SE</span>

              <span className="detail-brand-name">
                School Event
                <strong>Planner</strong>
              </span>
            </Link>

            <Link to="/events" className="detail-back">
              ← Kembali
            </Link>
          </div>
        </header>

        <div className="detail-state error">
          <span className="detail-state-label">
            ERROR
          </span>

          <strong>Kegiatan tidak ditemukan.</strong>

          <p>{error}</p>

          <Link
            to="/events"
            className="detail-state-button"
          >
            Kembali ke kegiatan
          </Link>
        </div>
      </main>
    );
  }

  const isTeam = event.category === "team";
  const isUpcoming = event.status === "upcoming";

  return (
    <main className="event-detail-page">
      {/* HEADER */}
      <header className="detail-header">
        <div className="detail-container detail-header-inner">
          <Link to="/" className="detail-brand">
            <span className="detail-brand-mark">SE</span>

            <span className="detail-brand-name">
              School Event
              <strong>Planner</strong>
            </span>
          </Link>

          <nav className="detail-nav">
            <Link to="/" className="detail-nav-link">
              Beranda
            </Link>

            <Link
              to="/events"
              className="detail-nav-link active"
            >
              Kegiatan
            </Link>

            {isLoggedIn ? (
              <Link
                to="/dashboard"
                className="detail-nav-button"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="detail-nav-link"
                >
                  Masuk
                </Link>

                <Link
                  to="/register"
                  className="detail-nav-button"
                >
                  Daftar
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="detail-hero">
        <div className="detail-container">
          <Link
            to="/events"
            className="detail-back"
          >
            ← Semua kegiatan
          </Link>

          <div className="detail-hero-content">
            <div className="detail-tag-row">
              <span className="detail-tag">
                {isTeam ? "TIM" : "INDIVIDU"}
              </span>

              {event.status && (
                <span className="detail-status">
                  {event.status === "upcoming"
                    ? "AKAN DATANG"
                    : event.status.toUpperCase()}
                </span>
              )}
            </div>

            <h1>{event.name}</h1>

            <p>
              {event.description ||
                "Informasi lengkap mengenai kegiatan sekolah."}
            </p>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="detail-content">
        <div className="detail-container detail-layout">
          <article className="detail-main">
            <span className="detail-eyebrow">
              DETAIL KEGIATAN
            </span>

            <h2>Tentang kegiatan</h2>

            <p className="detail-description">
              {event.description ||
                "Belum ada deskripsi kegiatan."}
            </p>

            <div className="detail-info-grid">
              <div className="detail-info-card">
                <span>TANGGAL</span>
                <strong>{event.date || "-"}</strong>
              </div>

              <div className="detail-info-card">
                <span>WAKTU</span>
                <strong>
                  {event.start_time || "-"} –{" "}
                  {event.end_time || "-"}
                </strong>
              </div>

              <div className="detail-info-card">
                <span>LOKASI</span>
                <strong>{event.location || "-"}</strong>
              </div>

              <div className="detail-info-card">
                <span>KATEGORI</span>
                <strong>
                  {isTeam
                    ? "Perlombaan Tim"
                    : "Individu"}
                </strong>
              </div>

              {event.max_participants && (
                <div className="detail-info-card">
                  <span>KUOTA</span>
                  <strong>
                    {event.max_participants} peserta
                  </strong>
                </div>
              )}

              {event.registration_deadline && (
                <div className="detail-info-card">
                  <span>PENDAFTARAN</span>
                  <strong>
                    {event.registration_deadline}
                  </strong>
                </div>
              )}
            </div>
          </article>

          {/* REGISTRATION CARD */}
          <aside className="detail-registration-card">
            <div className="detail-availability">
              <span
                className={
                  isUpcoming
                    ? "detail-dot open"
                    : "detail-dot"
                }
              />

              {isUpcoming
                ? "Pendaftaran tersedia"
                : "Pendaftaran ditutup"}
            </div>

            <span className="detail-card-label">
              PENDAFTARAN
            </span>

            <h2>
              Siap ikut
              <br />
              kegiatan ini?
            </h2>

            <p>
              Daftarkan dirimu dan ikuti kegiatan
              sekolah sesuai jadwal yang tersedia.
            </p>

            {error && (
              <div className="detail-alert">
                {error}
              </div>
            )}

            {success ? (
              <div className="detail-success">
                <div className="detail-success-icon">
                  ✓
                </div>

                <strong>
                  Pendaftaran berhasil
                </strong>

                <span>{success}</span>

                <Link
                  to="/dashboard"
                  className="detail-primary-button"
                >
                  Lihat dashboard
                </Link>
              </div>
            ) : (
              <>
                <button
                  type="button"
                  className="detail-primary-button"
                  onClick={handleRegister}
                  disabled={
                    !isUpcoming || registering
                  }
                >
                  {registering
                    ? "Mendaftarkan..."
                    : !isLoggedIn
                    ? "Masuk untuk mendaftar"
                    : "Daftar kegiatan"}
                </button>

                <span className="detail-note">
                  {isLoggedIn
                    ? "Pendaftaran akan tercatat pada akunmu."
                    : "Kamu perlu masuk ke akun terlebih dahulu untuk melakukan pendaftaran."}
                </span>
              </>
            )}
          </aside>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="detail-footer">
        <div className="detail-container detail-footer-inner">
          <div>
            <strong>
              School Event Planner
            </strong>

            <span>
              Platform kegiatan sekolah
            </span>
          </div>

          <span>
            © 2026 School Event Planner
          </span>
        </div>
      </footer>
    </main>
  );
}

export default EventDetail;