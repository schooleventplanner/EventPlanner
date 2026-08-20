import { useState } from "react";
import { Link } from "react-router-dom";
import { login } from "../services/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();

    setError("");

    if (!email || !password) {
      setError("Email dan password wajib diisi.");
      return;
    }

    setLoading(true);

    try {
      const data = await login(email, password);

      if (!data?.access_token) {
        throw new Error("Token login tidak ditemukan.");
      }

      localStorage.setItem(
        "access_token",
        data.access_token
      );

      window.location.href = "/";
    } catch (err) {
      setError(err.message || "Login gagal.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <Link to="/" className="login-brand">
          <span className="login-brand-mark">SE</span>

          <span>
            <strong>School Event</strong>
            <small>Planner</small>
          </span>
        </Link>

        <div className="login-heading">
          <span>SELAMAT DATANG</span>
          <h1>Masuk</h1>
          <p>
            Masuk untuk mengikuti kegiatan sekolah.
          </p>
        </div>

        {error && (
          <div className="login-error">
            {error}
          </div>
        )}

        <form
          className="login-form"
          onSubmit={submit}
        >
          <label>
            Email
            <input
              type="email"
              placeholder="nama@email.com"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              autoComplete="email"
            />
          </label>

          <label>
            Password
            <input
              type="password"
              placeholder="Masukkan password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              autoComplete="current-password"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
          >
            {loading ? "Memproses..." : "Masuk"}
          </button>
        </form>

        <p className="login-register">
          Belum punya akun?{" "}
          <Link to="/register">
            Daftar
          </Link>
        </p>

        <Link
          to="/"
          className="login-back"
        >
          ← Kembali
        </Link>
      </section>
    </main>
  );
}

export default Login;