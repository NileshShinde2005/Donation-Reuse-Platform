import "./Hero.css";
import { Link } from "react-router-dom";
import {
  FaHeart,
  FaShieldAlt,
  FaTruck,
  FaLock,
  FaBoxOpen,
  FaBuilding,
  FaUsers,
  FaMapMarkerAlt,
} from "react-icons/fa";

function Hero() {
  return (
    <>
      {/* HERO SECTION */}

      <section
        id="home"
        className="hero"
        data-aos="fade-up"
      >
        <div className="hero-left">

          <span className="hero-tag">
            <FaHeart />
            Small actions. Big impact.
          </span>

          <h1>
            Give More.
            <span className="highlight">
              {" "}Waste Less.
            </span>
          </h1>

          <p>
            Donate unused clothes and household items to verified NGOs
            and help people in need.
          </p>

          <div className="hero-buttons">

            <Link
              to="/donate"
              className="donate-btn"
            >
              <FaHeart />
              Donate Now
            </Link>

            <Link
              to="/ngos"
              className="ngo-btn"
            >
              Find NGOs
            </Link>

          </div>

          <div className="hero-features">

            <div>
              <FaShieldAlt />
              Verified NGOs
            </div>

            <div>
              <FaTruck />
              Free Pickup
            </div>

            <div>
              <FaLock />
              Safe & Secure
            </div>

          </div>

        </div>

        <div className="hero-right">

          <img
            src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=900"
            alt="Children smiling together"
          />

        </div>
      </section>


      {/* STATISTICS */}

      <section className="stats">

        <div className="stat-card">

          <div className="icon">
            <FaBoxOpen />
          </div>

          <div>
            <h2>5000+</h2>
            <p>Items Donated</p>
          </div>

        </div>


        <div className="stat-card">

          <div className="icon">
            <FaBuilding />
          </div>

          <div>
            <h2>120+</h2>
            <p>Verified NGOs</p>
          </div>

        </div>


        <div className="stat-card">

          <div className="icon">
            <FaUsers />
          </div>

          <div>
            <h2>2500+</h2>
            <p>Families Helped</p>
          </div>

        </div>


        <div className="stat-card">

          <div className="icon">
            <FaMapMarkerAlt />
          </div>

          <div>
            <h2>30+</h2>
            <p>Cities Covered</p>
          </div>

        </div>

      </section>
    </>
  );
}

export default Hero;