import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { register } from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    name: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function submit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await register(form);
      navigate("/login");
    } catch (error) {
      setError(error.message || "Pendaftaran gagal.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page">
      <Navbar />

      <section className="page-container page-main">
        <div className="auth-form-box card">
          <span className="home-eyebrow">PESERTA</span>

          <h1>Buat akun</h1>

          <p className="auth-subtitle">
            Buat akun untuk mengikuti kegiatan sekolah.
          </p>

          {error && <div className="alert">{error}</div>}

          <form className="form" onSubmit={submit}>
            <div className="field">
              <label>Nama</label>
              <input
                name="name"
                value={form.name}
                onChange={update}
                placeholder="Nama lengkap"
                required
              />
            </div>

            <div className="field">
              <label>Username</label>
              <input
                name="username"
                value={form.username}
                onChange={update}
                placeholder="Username"
                required
              />
            </div>

            <div className="field">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={update}
                placeholder="Email"
                required
              />
            </div>

            <div className="field">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={update}
                placeholder="Password"
                required
              />
            </div>

            <button className="btn btn-primary" disabled={loading}>
              {loading ? "Mendaftarkan..." : "Daftar"}
            </button>
          </form>

          <p className="auth-switch">
            Sudah punya akun?
            <Link to="/login"> Masuk</Link>
          </p>
        </div>
      </section>
    </main>
  );
}

export default Register;