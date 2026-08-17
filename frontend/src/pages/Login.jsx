import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Login.css";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8000";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  }

  async function handleSubmit(event) {
  event.preventDefault();
  setError("");
  setLoading(true);

  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.detail || "Email atau password salah."
      );
    }

    if (!data.access_token) {
      throw new Error("Token login tidak diterima.");
    }

    localStorage.setItem(
      "access_token",
      data.access_token
    );

    if (data.user) {
      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );
    } else {
      localStorage.removeItem("user");
    }

    const role = data.user?.role || data.role;

    if (role === "admin") {
      navigate("/admin", { replace: true });
    } else if (
      role === "committee" ||
      role === "staff"
    ) {
      navigate("/staff", { replace: true });
    } else {
      navigate("/dashboard", { replace: true });
    }
  } catch (err) {
    setError(
      err.message || "Gagal masuk ke akun."
    );
  } finally {
    setLoading(false);
  }
}

  return (
    <main className="login-page">
      <section className="login-brand-panel">
        <Link
          to="/"
          className="login-brand"
        >
          <span className="login-brand-mark">
            SE
          </span>

          <span>
            <strong>
              School Event
            </strong>

            <small>
              Planner
            </small>
          </span>
        </Link>

        <div className="login-brand-content">
          <span className="login-eyebrow">
            SCHOOL EVENT PLANNER
          </span>

          <h1>
            Semua kegiatan
            <br />
            <span>
              dalam satu tempat.
            </span>
          </h1>

          <p>
            Masuk untuk mengelola
            pendaftaran, mengikuti lomba,
            dan melihat aktivitas kegiatan
            sekolahmu.
          </p>
        </div>

        <div className="login-brand-footer">
          <span>EVENTS</span>
          <span>PARTICIPANTS</span>
          <span>2026</span>
        </div>
      </section>

      <section className="login-form-panel">
        <div className="login-form-box">
          <Link
            to="/"
            className="login-mobile-mark"
          >
            SE
          </Link>

          <div className="login-heading">
            <span className="login-eyebrow dark">
              WELCOME BACK
            </span>

            <h2>
              Masuk ke akun
            </h2>

            <p>
              Gunakan akunmu untuk
              melanjutkan.
            </p>
          </div>

          {error && (
            <div className="login-alert">
              <strong>
                Gagal masuk
              </strong>

              <span>
                {error}
              </span>
            </div>
          )}

          <form
            className="login-form"
            onSubmit={handleSubmit}
          >
            <div className="login-field">
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

            <div className="login-field">
              <div className="login-label-row">
                <label htmlFor="password">
                  Password
                </label>
              </div>

              <input
                id="password"
                name="password"
                type="password"
                placeholder="Masukkan password"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
                required
              />
            </div>

            <button
              type="submit"
              className="login-submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="login-button-spinner" />
                  Memproses...
                </>
              ) : (
                <>
                  Masuk
                  <span>↗</span>
                </>
              )}
            </button>
          </form>

          <div className="login-register">
            <span>
              Belum punya akun?
            </span>

            <Link to="/register">
              Daftar sekarang
            </Link>
          </div>

          <Link
            to="/"
            className="login-back"
          >
            ← Kembali ke beranda
          </Link>
        </div>
      </section>
    </main>
  );
}

export default Login;