import "./Footer.css";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";

function Footer() {
  return (
    <footer id="contact" className="footer">

      <div className="footer-container">

        {/* Column 1 */}

        <div className="footer-column">
          <h2>Donation & Reuse</h2>

          <p>
            Giving unused items a new life by connecting generous donors
            with NGOs and families in need. Every donation creates a
            meaningful impact.
          </p>
        </div>

        {/* Column 2 */}

        <div className="footer-column">
          <h3>Quick Links</h3>

          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="/donate">Donate</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>

        {/* Column 3 */}

        <div className="footer-column">
          <h3>Contact</h3>

          <p>
            <FaMapMarkerAlt /> Karnataka, India
          </p>

          <p>
            <FaEnvelope /> support@donationplatform.com
          </p>

          <p>
            <FaPhoneAlt /> +91 98765 43210
          </p>
        </div>

        {/* Column 4 */}

        <div className="footer-column">
          <h3>Follow Us</h3>

          <div className="social-icons">

            <a href="#"><FaFacebookF /></a>

            <a href="#"><FaInstagram /></a>

            <a href="#"><FaLinkedinIn /></a>

            <a href="#"><FaTwitter /></a>

          </div>
        </div>

      </div>

      <hr />

      <div className="copyright">

        © 2026 Donation & Reuse Platform | All Rights Reserved.

      </div>

    </footer>
  );
}

export default Footer;