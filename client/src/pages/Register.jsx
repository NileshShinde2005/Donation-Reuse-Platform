import "./Register.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";

import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

import registerImage from "../assets/images/login-illustration.png";

function Register() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  // =========================
  // FORM DATA
  // =========================

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "",
    terms: false,
  });

  // =========================
  // HANDLE INPUT
  // =========================

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // =========================
  // REGISTER
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // -------------------------
    // VALIDATION
    // -------------------------

    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.password ||
      !formData.confirmPassword ||
      !formData.role
    ) {
      toast.error("Please fill all fields.");
      return;
    }

    if (!formData.terms) {
      toast.error("Please accept the Terms & Conditions.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    // -------------------------
    // START LOADING
    // -------------------------

    setLoading(true);

    try {
      // -------------------------
      // SEND DATA TO SPRING BOOT
      // -------------------------

      const response = await fetch(
        "http://localhost:8080/api/users/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            password: formData.password,
            role: formData.role,
          }),
        }
      );

      // -------------------------
      // GET RESPONSE
      // -------------------------

      const data = await response.json();

      // -------------------------
      // ERROR
      // -------------------------

      if (!response.ok) {
        toast.error(
          typeof data === "string"
            ? data
            : "Registration failed."
        );

        return;
      }

      // -------------------------
      // AUTO LOGIN
      // -------------------------

      const loggedInUser = {
        id: data.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: data.role,
      };

      localStorage.setItem(
        "user",
        JSON.stringify(loggedInUser)
      );
      window.dispatchEvent(
      new Event("authChanged")
      );

      // -------------------------
      // SUCCESS
      // -------------------------

      toast.success(
        "Account created successfully! 🎉"
      );

      // -------------------------
      // GO TO DASHBOARD
      // -------------------------

      setTimeout(() => {
        navigate("/dashboard");
      }, 500);

    } catch (error) {
      console.error("Registration error:", error);

      toast.error(
        "Unable to connect to the server."
      );

    } finally {
      setLoading(false);
    }
  };

  // =========================
  // UI
  // =========================

  return (
    <div className="register-page">

      <div
        className="register-container"
        data-aos="zoom-in"
      >

        {/* =========================
            LEFT SIDE
        ========================= */}

        <div className="register-left">

          <h1>
            Join Our Community 💚
          </h1>

          <p>
            Create your account and start
            making a difference by donating
            clothes and household items to
            people who need them.
          </p>

          <img
            src={registerImage}
            alt="Register"
          />

        </div>

        {/* =========================
            RIGHT SIDE
        ========================= */}

        <div className="register-right">

          <h2>
            Create Account
          </h2>

          <form onSubmit={handleSubmit}>

            {/* NAME */}

            <div className="input-box">

              <FaUser />

              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
              />

            </div>

            {/* EMAIL */}

            <div className="input-box">

              <FaEnvelope />

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
              />

            </div>

            {/* PHONE */}

            <div className="input-box">

              <FaPhone />

              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
              />

            </div>

            {/* PASSWORD */}

            <div className="input-box">

              <FaLock />

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />

              {showPassword ? (

                <FaEyeSlash
                  className="eye"
                  onClick={() =>
                    setShowPassword(false)
                  }
                />

              ) : (

                <FaEye
                  className="eye"
                  onClick={() =>
                    setShowPassword(true)
                  }
                />

              )}

            </div>

            {/* CONFIRM PASSWORD */}

            <div className="input-box">

              <FaLock />

              <input
                type={
                  showConfirm
                    ? "text"
                    : "password"
                }
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />

              {showConfirm ? (

                <FaEyeSlash
                  className="eye"
                  onClick={() =>
                    setShowConfirm(false)
                  }
                />

              ) : (

                <FaEye
                  className="eye"
                  onClick={() =>
                    setShowConfirm(true)
                  }
                />

              )}

            </div>

            {/* ROLE */}

            <select
              className="role-select"
              name="role"
              value={formData.role}
              onChange={handleChange}
            >

              <option value="">
                Choose Role
              </option>

              <option value="Donor">
                Donor
              </option>

              <option value="NGO">
                NGO
              </option>

            </select>

            {/* TERMS */}

            <label className="terms">

              <input
                type="checkbox"
                name="terms"
                checked={formData.terms}
                onChange={handleChange}
              />

              I agree to the Terms &
              Conditions

            </label>

            {/* REGISTER */}

            <button
              type="submit"
              className="register-btn"
              disabled={loading}
            >
              {loading
                ? "Creating Account..."
                : "Create Account"}
            </button>

            {/* LOGIN */}

            <p className="login-link">

              Already have an account?

              <Link to="/login">
                Login
              </Link>

            </p>

          </form>

        </div>

      </div>

    </div>
  );
}

export default Register;