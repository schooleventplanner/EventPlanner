import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("access_token");
    window.location.replace("/login");
  }

  const menus = [
    {
      title: "Jadwal Acara",
      description: "Lihat jadwal kegiatan dan acara sekolah.",
      icon: "JA",
      path: "/events",
    },
    {
      title: "Daftar Lomba",
      description: "Lihat dan ikuti lomba yang tersedia.",
      icon: "DL",
      path: "/events",
    },
    {
      title: "Lokasi",
      description: "Lihat lokasi pelaksanaan kegiatan.",
      icon: "LO",
      path: "/locations",
    },
    {
      title: "Peserta",
      description: "Lihat daftar peserta kegiatan dan lomba.",
      icon: "PE",
      path: "/participants",
    },
    {
      title: "Pengumuman",
      description: "Lihat informasi dan pengumuman terbaru.",
      icon: "PG",
      path: "/announcements",
    },
  ];

  return (
    <main className="home-page">
      <header className="home-header">
        <div className="home-brand">
          <span className="home-brand-mark">SE</span>

          <div>
            <strong>School Event</strong>
            <small>Planner</small>
          </div>
        </div>

        <button
          type="button"
          className="home-logout"
          onClick={logout}
        >
          Keluar
        </button>
      </header>

      <section className="home-hero">
        <div>
          <span className="home-eyebrow">
            SCHOOL EVENT PLANNER
          </span>

          <h1>
            Kelola dan ikuti
            <br />
            kegiatan sekolah.
          </h1>

          <p>
            Temukan jadwal, lomba, lokasi, peserta,
            dan pengumuman kegiatan sekolah.
          </p>
        </div>
      </section>

      <section className="home-content">
        <div className="home-section-heading">
          <div>
            <span>MENU UTAMA</span>
            <h2>Jelajahi kegiatan</h2>
          </div>
        </div>

        <div className="home-menu-grid">
          {menus.map((menu) => (
            <button
              key={menu.title}
              type="button"
              className="home-menu-card"
              onClick={() => navigate(menu.path)}
            >
              <span className="home-menu-icon">
                {menu.icon}
              </span>

              <span className="home-menu-text">
                <strong>{menu.title}</strong>
                <small>{menu.description}</small>
              </span>

              <span className="home-menu-arrow">
                →
              </span>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}

export default Home;