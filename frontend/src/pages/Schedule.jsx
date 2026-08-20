import { Link } from "react-router-dom";

function Schedule() {
  const schedules = [
    {
      time: "08.00",
      title: "Pembukaan",
      location: "Lapangan Sekolah",
    },
    {
      time: "09.00",
      title: "Lomba 17 Agustus",
      location: "Area Sekolah",
    },
    {
      time: "13.00",
      title: "Pengumuman Pemenang",
      location: "Aula Sekolah",
    },
  ];

  return (
    <main className="simple-page">
      <div className="page-container">
        <Link to="/" className="back-link-dark">
          ← Kembali
        </Link>

        <div className="simple-header">
          <span className="eyebrow">JADWAL ACARA</span>
          <h1>Jadwal kegiatan</h1>
          <p>
            Lihat seluruh jadwal kegiatan 17 Agustus.
          </p>
        </div>

        <div className="simple-list">
          {schedules.map((item, index) => (
            <div className="simple-card" key={index}>
              <strong>{item.time}</strong>

              <div>
                <h3>{item.title}</h3>
                <p>{item.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

export default Schedule;