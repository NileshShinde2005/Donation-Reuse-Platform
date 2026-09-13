import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBuilding, FaMapMarkerAlt, FaPhone, FaCheckCircle } from "react-icons/fa";
import "./NGOs.css";

function NGOs() {
  const navigate = useNavigate();

  const [ngos, setNgos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8080/api/ngos/verified")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch NGOs");
        }

        return response.json();
      })
      .then((data) => {
        setNgos(data);
      })
      .catch((error) => {
        console.error("NGO Fetch Error:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleSelect = (ngo) => {
    localStorage.setItem(
      "selectedNGO",
      JSON.stringify(ngo)
    );

    navigate("/donate");
  };

  return (
    <div className="ngo-page">

      <div className="ngo-header">
        <h1>Verified NGOs & Beneficiaries 🤝</h1>

        <p>
          Choose a verified organization to support
          through your donation.
        </p>
      </div>

      {loading ? (
        <div className="ngo-message">
          Loading verified organizations...
        </div>
      ) : ngos.length === 0 ? (
        <div className="ngo-message">
          <FaBuilding />

          <h2>No verified organizations yet</h2>

          <p>
            Verified NGOs and beneficiaries will appear
            here once approved by the administrator.
          </p>
        </div>
      ) : (
        <div className="ngo-grid">

          {ngos.map((ngo) => (

            <div
              className="ngo-card"
              key={ngo.id}
            >

              <div className="ngo-icon">
                <FaBuilding />
              </div>

              <div className="ngo-card-content">

                <div className="ngo-title">

                  <h2>{ngo.name}</h2>

                  {ngo.verified && (
                    <span className="verified-badge">
                      <FaCheckCircle />
                      Verified
                    </span>
                  )}

                </div>

                <p className="ngo-type">
                  {ngo.type}
                </p>

                <p>
                  <FaMapMarkerAlt />
                  {ngo.city}
                </p>

                <p>
                  <FaPhone />
                  {ngo.phone}
                </p>

                <p className="ngo-address">
                  {ngo.address}
                </p>

                <button
                  className="select-ngo-btn"
                  onClick={() => handleSelect(ngo)}
                >
                  Select Organization
                </button>

              </div>

            </div>

          ))}

        </div>
      )}

    </div>
  );
}

export default NGOs;