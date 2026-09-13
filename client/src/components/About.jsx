import "./About.css";
import {
  FaShieldAlt,
  FaBoxOpen,
  FaTruck,
  FaLeaf,
} from "react-icons/fa";

function About() {
  return (
    <section id="about" className="about">

      <div className="about-content">

        <div className="about-heading">
          <h4>ABOUT US</h4>

          <h2>
            Simple Donations.
            <span> Meaningful Impact.</span>
          </h2>

          <p>
            We connect donors with verified NGOs and make it easier to give
            unused items a second life.
          </p>
        </div>

        <div className="about-features">

          <div className="feature-box">
            <div className="feature-icon">
              <FaShieldAlt />
            </div>

            <div>
              <h3>Verified NGOs</h3>
              <p>Trusted organizations only.</p>
            </div>
          </div>

          <div className="feature-box">
            <div className="feature-icon">
              <FaBoxOpen />
            </div>

            <div>
              <h3>Easy Donation</h3>
              <p>Donate useful items easily.</p>
            </div>
          </div>

          <div className="feature-box">
            <div className="feature-icon">
              <FaTruck />
            </div>

            <div>
              <h3>Pickup Support</h3>
              <p>Convenient doorstep pickup.</p>
            </div>
          </div>

          <div className="feature-box">
            <div className="feature-icon">
              <FaLeaf />
            </div>

            <div>
              <h3>Eco Friendly</h3>
              <p>Give items a second life.</p>
            </div>
          </div>

        </div>

      </div>

    </section>
  );
}

export default About;