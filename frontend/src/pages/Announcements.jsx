import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getAnnouncements } from "../services/api";

function Announcements() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAnnouncements()
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="page">
      <Navbar />

      <section className="page-container page-main">
        <div className="page-title">
          <span className="home-eyebrow">INFORMASI</span>
          <h1>Pengumuman</h1>
          <p>Informasi terbaru mengenai kegiatan sekolah.</p>
        </div>

        {loading ? (
          <div className="home-state">
            <div className="home-spinner" />
            <strong>Memuat pengumuman...</strong>
          </div>
        ) : items.length === 0 ? (
          <div className="home-state">
            <h3>Belum ada pengumuman.</h3>
            <p>Pengumuman terbaru akan muncul di sini.</p>
          </div>
        ) : (
          <div className="grid">
            {items.map((item, index) => (
              <article className="card announcement-card" key={item.id || index}>
                <span className="home-eyebrow">
                  PENGUMUMAN #{index + 1}
                </span>

                <h2>{item.title || item.name}</h2>

                <p>
                  {item.content ||
                    item.description ||
                    "Tidak ada isi pengumuman."}
                </p>

                {item.date && (
                  <small>{item.date}</small>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default Announcements;