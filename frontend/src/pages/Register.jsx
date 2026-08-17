import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Register.css";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8000";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Konfirmasi password tidak cocok.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 422 && Array.isArray(data.detail)) {
          const messages = data.detail.map((item) => {
            const field = item.loc?.at(-1) || "field";
            return `${field}: ${item.msg}`;
          });

          throw new Error(messages.join(", "));
        }

        throw new Error(
          data.detail || "Registrasi gagal."
        );
      }

      navigate("/login");
    } catch (err) {
      setError(err.message || "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="register-page">
      <section className="register-brand">
        <Link to="/" className="register-brand-logo">
          <span className="register-brand-mark">SE</span>

          <span>
            <strong>School Event</strong>
            <small>Planner</small>
          </span>
        </Link>

        <div className="register-brand-content">
          <span className="register-eyebrow">
            SCHOOL EVENT PLANNER
          </span>

          <h1>
            Mulai ikut
            <br />
            <span>kegiatan sekolah.</span>
          </h1>

          <p>
            Buat akun untuk mendaftar lomba, melihat
            kegiatan yang kamu ikuti, dan memantau
            status pendaftaranmu.
          </p>
        </div>

        <div className="register-brand-footer">
          <span>EVENTS · ACTIVITIES · PARTICIPATION</span>
          <span>2026</span>
        </div>
      </section>

      <section className="register-form-side">
        <div className="register-form-box">
          <Link to="/" className="register-mobile-logo">
            SE
          </Link>

          <span className="register-form-eyebrow">
            BUAT AKUN
          </span>

          <h2>Daftar</h2>

          <p className="register-subtitle">
            Isi data berikut untuk membuat akun peserta.
          </p>

          {error && (
            <div className="register-alert">
              <strong>!</strong>
              <span>{error}</span>
            </div>
          )}

          <form
            className="register-form"
            onSubmit={handleSubmit}
          >
            <div className="register-field">
              <label htmlFor="name">
                Nama lengkap
              </label>

              <input
                id="name"
                name="name"
                type="text"
                placeholder="Masukkan nama lengkap"
                value={form.name}
                onChange={handleChange}
                autoComplete="name"
                required
              />
            </div>

            <div className="register-field">
              <label htmlFor="email">
                Email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                placeholder="Masukkan email"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />
            </div>

            <div className="register-field">
              <label htmlFor="password">
                Password
              </label>

              <input
                id="password"
                name="password"
                type="password"
                placeholder="Buat password"
                value={form.password}
                onChange={handleChange}
                autoComplete="new-password"
                required
              />
            </div>

            <div className="register-field">
              <label htmlFor="confirmPassword">
                Konfirmasi password
              </label>

              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Ulangi password"
                value={form.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
                required
              />
            </div>

            <button
              type="submit"
              className="register-submit"
              disabled={loading}
            >
              {loading
                ? "Membuat akun..."
                : "Buat akun"}
            </button>
          </form>

          <div className="register-switch">
            <span>Sudah punya akun?</span>
            <Link to="/login">Masuk</Link>
          </div>

          <Link to="/" className="register-back">
            ← Kembali ke beranda
          </Link>
        </div>
      </section>
    </main>
  );
}

export default Register;