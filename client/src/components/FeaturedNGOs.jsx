import "./FeaturedNGOs.css";
import ngoData from "../data/ngoData";
import {
  FaMapMarkerAlt,
  FaStar,
} from "react-icons/fa";

function FeaturedNGOs() {
  return (
    <section id="ngos" className="featured-ngos">

      <div className="section-title">

        <div>
          <h4>OUR PARTNERS</h4>

          <h2>Featured NGOs</h2>
        </div>

        <p>
          Trusted organizations helping communities across India.
        </p>

      </div>


      <div className="ngo-grid">

        {ngoData.slice(0, 4).map((ngo) => {

          const Icon = ngo.icon;

          return (
            <div
              className="ngo-card"
              key={ngo.id}
            >

              <div className="ngo-card-top">

                <div className="ngo-icon">
                  <Icon />
                </div>

                <div className="ngo-rating">
                  <FaStar />
                  <span>{ngo.rating}</span>
                </div>

              </div>


              <h3>
                {ngo.name}
              </h3>


              <div className="ngo-location">

                <FaMapMarkerAlt />

                <span>
                  {ngo.city}
                </span>

              </div>


              <div className="ngo-category">
                {ngo.category}
              </div>


              <p>
                {ngo.description}
              </p>

            </div>
          );
        })}

      </div>

    </section>
  );
}

export default FeaturedNGOs;