import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getEvents } from "../services/api";
import "../styles/StaffDashboard.css";

const API_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const emptyForm = {
  name: "",
  description: "",
  category: "individual",
  date: "",
  start_time: "",
  end_time: "",
  location: "",
  max_participants: 50,
};

function StaffDashboard() {
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const token = localStorage.getItem("access_token");

  useEffect(() => {
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    loadEvents();
  }, [navigate, token]);

  async function loadEvents() {
    try {
      setLoading(true);
      setError("");

      const data = await getEvents();

      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err.message || "Gagal memuat kegiatan."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]:
        name === "max_participants"
          ? Number(value)
          : value,
    }));
  }

  function openCreateForm() {
    setEditingId(null);
    setForm({ ...emptyForm });
    setError("");
    setShowForm(true);
  }

  function openEditForm(item) {
    setEditingId(item.id);

    setForm({
      name: item.name || "",
      description: item.description || "",
      category: item.category || "individual",
      date: item.date || "",
      start_time: item.start_time || "",
      end_time: item.end_time || "",
      location: item.location || "",
      max_participants:
        item.max_participants || 50,
    });

    setError("");
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
    setForm({ ...emptyForm });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setSaving(true);
    setError("");

    try {
      const url = editingId
        ? `${API_URL}/events/${editingId}`
        : `${API_URL}/events`;

      const response = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
            "Gagal menyimpan kegiatan."
        );
      }

      closeForm();
      await loadEvents();
    } catch (err) {
      setError(
        err.message ||
          "Gagal menyimpan kegiatan."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (
      !window.confirm(
        "Yakin ingin menghapus kegiatan ini?"
      )
    ) {
      return;
    }

    try {
      setError("");

      const response = await fetch(
        `${API_URL}/events/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
            "Gagal menghapus kegiatan."
        );
      }

      await loadEvents();
    } catch (err) {
      setError(
        err.message ||
          "Gagal menghapus kegiatan."
      );
    }
  }

  function handleLogout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");

    navigate("/login", {
      replace: true,
    });
  }

  const openCount = events.filter(
    (item) => item.registration_open
  ).length;

  const teamCount = events.filter(
    (item) => item.category === "team"
  ).length;

  const individualCount = events.filter(
    (item) => item.category === "individual"
  ).length;

  return (
    <main className="staff-page">
      <header className="staff-header">
        <div className="staff-container staff-header-inner">
          <Link
            to="/"
            className="staff-brand"
          >
            <span className="staff-brand-mark">
              SE
            </span>

            <span className="staff-brand-name">
              School Event
              <strong>Planner</strong>
            </span>
          </Link>

          <nav className="staff-nav">
            <Link to="/events">
              Kegiatan
            </Link>

            

            <span className="staff-role">
              PANITIA
            </span>

            <button
              type="button"
              className="staff-logout"
              onClick={handleLogout}
            >
              Keluar
            </button>
          </nav>
        </div>
      </header>

      <section className="staff-container staff-hero">
        <div className="staff-hero-content">
          <span className="staff-eyebrow">
            PANEL PANITIA
          </span>

          <h1>
            Kelola kegiatan.
          </h1>

          <p>
            Buat, edit, dan kelola seluruh
            kegiatan sekolah dari satu tempat.
          </p>
        </div>

        <button
          type="button"
          className="staff-primary-button"
          onClick={openCreateForm}
        >
          <span>+</span>
          Buat kegiatan
        </button>
      </section>

      <section className="staff-container staff-stats">
        <article className="staff-stat staff-stat-primary">
          <span>
            TOTAL KEGIATAN
          </span>

          <strong>
            {events.length}
          </strong>

          <small>
            Semua kegiatan
          </small>
        </article>

        <article className="staff-stat">
          <span>
            TERBUKA
          </span>

          <strong>
            {openCount}
          </strong>

          <small>
            Pendaftaran aktif
          </small>
        </article>

        <article className="staff-stat">
          <span>
            TIM
          </span>

          <strong>
            {teamCount}
          </strong>

          <small>
            Kegiatan berkelompok
          </small>
        </article>

        <article className="staff-stat">
          <span>
            INDIVIDU
          </span>

          <strong>
            {individualCount}
          </strong>

          <small>
            Kegiatan individu
          </small>
        </article>
      </section>

      <section className="staff-container staff-content">
        {error && (
          <div className="staff-alert">
            <strong>!</strong>
            <span>{error}</span>
          </div>
        )}

        <div className="staff-section-heading">
          <div>
            <span className="staff-eyebrow">
              DAFTAR KEGIATAN
            </span>

            <h2>
              Semua kegiatan
            </h2>
          </div>

          <span className="staff-result-count">
            {events.length} kegiatan
          </span>
        </div>

        {loading ? (
          <div className="staff-state">
            <div className="staff-spinner" />

            <strong>
              Memuat kegiatan
            </strong>

            <span>
              Menyiapkan panel panitia...
            </span>
          </div>
        ) : events.length === 0 ? (
          <div className="staff-empty">
            <div className="staff-empty-icon">
              +
            </div>

            <span className="staff-eyebrow">
              BELUM ADA DATA
            </span>

            <h3>
              Belum ada kegiatan.
            </h3>

            <p>
              Buat kegiatan pertama untuk
              mulai mengisi event planner.
            </p>

            <button
              type="button"
              className="staff-primary-button"
              onClick={openCreateForm}
            >
              + Buat kegiatan
            </button>
          </div>
        ) : (
          <div className="staff-event-list">
            {events.map((item, index) => (
              <article
                className="staff-event-card"
                key={item.id}
              >
                <div className="staff-event-number">
                  {String(index + 1).padStart(
                    2,
                    "0"
                  )}
                </div>

                <div className="staff-event-info">
                  <div className="staff-tag-row">
                    <span className="staff-tag">
                      {item.category === "team"
                        ? "TIM"
                        : "INDIVIDU"}
                    </span>

                    <span
                      className={
                        item.registration_open
                          ? "staff-status open"
                          : "staff-status closed"
                      }
                    >
                      {item.registration_open
                        ? "Pendaftaran dibuka"
                        : "Ditutup"}
                    </span>
                  </div>

                  <h3>
                    {item.name}
                  </h3>

                  <p>
                    {item.date}
                    {" · "}
                    {item.start_time}
                    {" – "}
                    {item.end_time}
                    {" · "}
                    {item.location}
                  </p>
                </div>

                <div className="staff-event-limit">
                  <span>
                    MAKS. PESERTA
                  </span>

                  <strong>
                    {item.max_participants}
                  </strong>
                </div>

                <div className="staff-event-actions">
                  <button
                    type="button"
                    onClick={() =>
                      openEditForm(item)
                    }
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="danger"
                    onClick={() =>
                      handleDelete(item.id)
                    }
                  >
                    Hapus
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {showForm && (
        <div
          className="staff-modal-backdrop"
          onMouseDown={closeForm}
        >
          <section
            className="staff-modal"
            onMouseDown={(event) =>
              event.stopPropagation()
            }
          >
            <div className="staff-modal-header">
              <div>
                <span className="staff-eyebrow">
                  {editingId
                    ? "EDIT KEGIATAN"
                    : "KEGIATAN BARU"}
                </span>

                <h2>
                  {editingId
                    ? "Edit kegiatan"
                    : "Buat kegiatan"}
                </h2>
              </div>

              <button
                type="button"
                className="staff-modal-close"
                onClick={closeForm}
              >
                ×
              </button>
            </div>

            <form
              className="staff-form"
              onSubmit={handleSubmit}
            >
              <div className="staff-field">
                <label htmlFor="name">
                  Nama kegiatan
                </label>

                <input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Contoh: Futsal Putra"
                  required
                  minLength={2}
                />
              </div>

              <div className="staff-field">
                <label htmlFor="description">
                  Deskripsi
                </label>

                <textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Jelaskan kegiatan..."
                  required
                  rows={4}
                />
              </div>

              <div className="staff-field-grid">
                <div className="staff-field">
                  <label htmlFor="category">
                    Kategori
                  </label>

                  <select
                    id="category"
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                  >
                    <option value="individual">
                      Individu
                    </option>

                    <option value="team">
                      Tim
                    </option>
                  </select>
                </div>

                <div className="staff-field">
                  <label htmlFor="max_participants">
                    Maks. peserta
                  </label>

                  <input
                    id="max_participants"
                    name="max_participants"
                    type="number"
                    min="1"
                    max="1000"
                    value={
                      form.max_participants
                    }
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="staff-field-grid">
                <div className="staff-field">
                  <label htmlFor="date">
                    Tanggal
                  </label>

                  <input
                    id="date"
                    name="date"
                    type="date"
                    value={form.date}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="staff-field">
                  <label htmlFor="location">
                    Lokasi
                  </label>

                  <input
                    id="location"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="Lokasi kegiatan"
                    required
                  />
                </div>
              </div>

              <div className="staff-field-grid">
                <div className="staff-field">
                  <label htmlFor="start_time">
                    Waktu mulai
                  </label>

                  <input
                    id="start_time"
                    name="start_time"
                    type="time"
                    value={form.start_time}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="staff-field">
                  <label htmlFor="end_time">
                    Waktu selesai
                  </label>

                  <input
                    id="end_time"
                    name="end_time"
                    type="time"
                    value={form.end_time}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="staff-modal-actions">
                <button
                  type="button"
                  className="staff-secondary-button"
                  onClick={closeForm}
                >
                  Batal
                </button>

                <button
                  type="submit"
                  className="staff-primary-button"
                  disabled={saving}
                >
                  {saving
                    ? "Menyimpan..."
                    : editingId
                      ? "Simpan perubahan"
                      : "Buat kegiatan"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}

export default StaffDashboard;