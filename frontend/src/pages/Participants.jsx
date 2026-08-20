import { Link } from "react-router-dom";

function Participants() {
  const participants = [
    {
      name: "Peserta terdaftar",
      count: "—",
    },
    {
      name: "Peserta lomba individu",
      count: "—",
    },
    {
      name: "Peserta lomba tim",
      count: "—",
    },
  ];

  return (
    <main className="simple-page">
      <div className="page-container">
        <Link to="/" className="back-link-dark">
          ← Kembali
        </Link>

        <div className="simple-header">
          <span className="eyebrow">PESERTA</span>
          <h1>Daftar peserta</h1>
          <p>
            Lihat peserta yang mengikuti kegiatan sekolah.
          </p>
        </div>

        <div className="simple-list">
          {participants.map((item, index) => (
            <div className="simple-card" key={index}>
              <div>
                <h3>{item.name}</h3>
              </div>

              <strong className="participant-count">
                {item.count}
              </strong>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

export default Participants;