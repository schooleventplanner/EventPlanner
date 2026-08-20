import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getEvent, registerEvent } from "../services/api";

function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    getEvent(id)
      .then(setEvent)
      .catch(() => setEvent(null))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleRegister() {
    const token = localStorage.getItem("access_token");

    if (!token) {
      navigate("/login");
      return;
    }

    setRegistering(true);
    setMessage("");

    try {
      await registerEvent(id);
      setSuccess(true);
      setMessage("Pendaftaran berhasil.");
    } catch (error) {
      setMessage(error.message || "Pendaftaran gagal.");
    } finally {
      setRegistering(false);
    }
  }

  if (loading) {
    return (
      <main className="page">
        <Navbar />
        <div className="page-container page-main">
          <div className="home-state">
            <div className="home-spinner" />
            <strong>Memuat kegiatan...</strong>
          </div>
        </div>
      </main>
    );
  }

  if (!event) {
    return (
      <main className="page">
        <Navbar />
        <div className="not-found">
          <strong>404</strong>
          <h2>Kegiatan tidak ditemukan</h2>
          <Link to="/events">Kembali ke kegiatan</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="page">
      <Navbar />

      <section className="detail-hero">
        <div className="page-container">
          <Link to="/events" className="back-link">
            ← Kembali ke kegiatan
          </Link>

          <div className="detail-hero-content">
            <span className="home-tag">
              {event.category === "team" ? "TIM" : "INDIVIDU"}
            </span>

            <h1>{event.name}</h1>

            <p>
              {event.description ||
                "Informasi lengkap mengenai kegiatan sekolah."}
            </p>
          </div>
        </div>
      </section>

      <section className="page-container page-main">
        <div className="detail-grid">
          <div>
            <span className="home-eyebrow">INFORMASI ACARA</span>

            <h2>Detail kegiatan</h2>

            <p className="detail-description">
              Pastikan kamu mengetahui jadwal dan lokasi
              sebelum melakukan pendaftaran.
            </p>

            <div className="info-grid">
              <div className="info-card">
                <span>TANGGAL</span>
                <strong>{event.date || "-"}</strong>
              </div>

              <div className="info-card">
                <span>LOKASI</span>
                <strong>{event.location || "-"}</strong>
              </div>

              <div className="info-card">
                <span>KATEGORI</span>
                <strong>
                  {event.category === "team" ? "Tim" : "Individu"}
                </strong>
              </div>

              <div className="info-card">
                <span>STATUS</span>
                <strong>{event.status || "upcoming"}</strong>
              </div>
            </div>
          </div>

          <aside className="registration-card-panel">
            <span className="home-eyebrow">
              PENDAFTARAN
            </span>

            <h2>Ikuti kegiatan ini</h2>

            <p>
              Daftarkan dirimu sebagai peserta melalui
              tombol di bawah.
            </p>

            {message && (
              <div className={`alert ${success ? "success" : ""}`}>
                {message}
              </div>
            )}

            <button
              className="btn btn-primary full"
              disabled={registering || success}
              onClick={handleRegister}
            >
              {registering
                ? "Mendaftarkan..."
                : success
                ? "Sudah terdaftar"
                : "Daftar sekarang"}
            </button>

            {!localStorage.getItem("access_token") && (
              <small className="panel-note">
                Kamu perlu login terlebih dahulu untuk mendaftar.
              </small>
            )}
          </aside>
        </div>
      </section>
    </main>
  );
}

export default EventDetail;