import { Link } from "react-router-dom";

function Locations() {
  const locations = [
    {
      name: "Lapangan Sekolah",
      event: "Pembukaan & kegiatan utama",
    },
    {
      name: "Aula Sekolah",
      event: "Pengumuman pemenang",
    },
    {
      name: "Area Sekolah",
      event: "Berbagai perlombaan",
    },
  ];

  return (
    <main className="simple-page">
      <div className="page-container">
        <Link to="/" className="back-link-dark">
          ← Kembali
        </Link>

        <div className="simple-header">
          <span className="eyebrow">LOKASI</span>
          <h1>Lokasi kegiatan</h1>
          <p>
            Temukan lokasi pelaksanaan setiap kegiatan.
          </p>
        </div>

        <div className="simple-list">
          {locations.map((item, index) => (
            <div className="simple-card" key={index}>
              <span className="simple-number">
                {String(index + 1).padStart(2, "0")}
              </span>

              <div>
                <h3>{item.name}</h3>
                <p>{item.event}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

export default Locations;