import "./Login.css";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  FaEnvelope,
  FaLock,
  FaEye,
} from "react-icons/fa";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import { toast } from "react-toastify";

import loginImage from "../assets/images/login-illustration.png";


function Login() {

  const navigate = useNavigate();

  const [showPassword, setShowPassword] =
    useState(false);

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const googleButtonRef =
    useRef(null);


  // ==========================================
  // GOOGLE LOGIN RESPONSE
  // ==========================================

  const handleGoogleResponse = async (
    response
  ) => {

    try {

      // =========================
      // DECODE GOOGLE TOKEN
      // =========================

      const base64Url =
        response.credential.split(".")[1];

      const base64 =
        base64Url
          .replace(/-/g, "+")
          .replace(/_/g, "/");

      const payload =
        JSON.parse(
          atob(base64)
        );


      // =========================
      // SEND GOOGLE USER TO BACKEND
      // =========================

      const backendResponse =
        await fetch(
          "https://donation-reuse-platform.onrender.com/api/users/google-login",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              name:
                payload.name,

              email:
                payload.email,

              phone:
                "",

              role:
                "Donor",
            }),
          }
        );


      // =========================
      // BACKEND ERROR
      // =========================

      if (!backendResponse.ok) {

        const errorText =
          await backendResponse.text();

        throw new Error(
          errorText ||
          "Google login failed"
        );
      }


      // =========================
      // GET REAL DATABASE USER
      // =========================

      const data =
        await backendResponse.json();


      // =========================
      // IMPORTANT
      // data.id = MYSQL ID
      // data.createdAt = MEMBER SINCE
      // =========================

      const googleUser = {

        id:
          data.id,

        name:
          data.name,

        email:
          data.email,

        phone:
          data.phone || "",

        role:
          data.role || "Donor",

        createdAt:
          data.createdAt,

        picture:
          payload.picture || "",

        provider:
          "google",
      };


      // =========================
      // SAVE SESSION
      // =========================

      localStorage.setItem(
        "user",
        JSON.stringify(
          googleUser
        )
      );


      window.dispatchEvent(
        new Event("authChanged")
      );


      // =========================
      // SUCCESS
      // =========================

      toast.success(
        `Welcome ${googleUser.name}!`
      );


      navigate("/dashboard");


    } catch (error) {

      console.error(
        "Google Login Error:",
        error
      );

      toast.error(
        error.message ||
        "Google login failed. Please try again."
      );
    }
  };


  // ==========================================
  // INITIALIZE GOOGLE
  // ==========================================

  useEffect(() => {

    let interval;


    const initializeGoogle = () => {

      if (
        !window.google ||
        !window.google.accounts ||
        !googleButtonRef.current
      ) {

        return false;
      }


      googleButtonRef.current.innerHTML =
        "";


      window.google.accounts.id.initialize({

        client_id:
          import.meta.env
            .VITE_GOOGLE_CLIENT_ID,

        callback:
          handleGoogleResponse,

      });


      window.google.accounts.id.renderButton(

        googleButtonRef.current,

        {
          theme: "outline",
          size: "large",
          width: 350,
          text: "continue_with",
          shape: "rectangular",
        }

      );


      return true;
    };


    // =========================
    // GOOGLE SCRIPT
    // =========================

    if (!initializeGoogle()) {

      interval =
        setInterval(() => {

          if (initializeGoogle()) {

            clearInterval(
              interval
            );
          }

        }, 100);
    }


    return () => {

      if (interval) {

        clearInterval(
          interval
        );
      }
    };

  }, []);


  // ==========================================
  // NORMAL LOGIN
  // ==========================================

  const handleLogin = async (e) => {

    e.preventDefault();


    // =========================
    // VALIDATION
    // =========================

    if (!email || !password) {

      toast.error(
        "Please enter email and password."
      );

      return;
    }


    setLoading(true);


    try {

      // =========================
      // LOGIN API
      // =========================

      const response =
        await fetch(
          "https://donation-reuse-platform.onrender.com/api/users/login",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              email:
                email,

              password:
                password,
            }),
          }
        );


      const data =
        await response.json();


      // =========================
      // LOGIN FAILED
      // =========================

      if (!response.ok) {

        toast.error(

          typeof data === "string"
            ? data
            : "Invalid email or password."

        );

        return;
      }


      // =========================
      // SAVE REAL DATABASE USER
      // =========================

      const loggedInUser = {

        id:
          data.id,

        name:
          data.name,

        email:
          data.email,

        phone:
          data.phone,

        role:
          data.role,

        createdAt:
          data.createdAt,
      };


      localStorage.setItem(
        "user",
        JSON.stringify(
          loggedInUser
        )
      );


      window.dispatchEvent(
        new Event("authChanged")
      );


      // =========================
      // SUCCESS
      // =========================

      toast.success(
        "Login successful! 🎉"
      );


      setTimeout(() => {

        navigate("/dashboard");

      }, 500);


    } catch (error) {

      console.error(
        "Login error:",
        error
      );

      toast.error(
        "Unable to connect to the server."
      );

    } finally {

      setLoading(false);
    }
  };


  // ==========================================
  // UI
  // ==========================================

  return (

    <div className="login-page">

      <div className="login-container">


        {/* LEFT SIDE */}

        <div className="login-left">

          <h1>
            Welcome Back 👋
          </h1>

          <p>
            Sign in to continue donating
            and helping people in need.
          </p>

          <img
            src={loginImage}
            alt="Login Illustration"
          />

        </div>


        {/* RIGHT SIDE */}

        <div className="login-right">

          <h2>
            Login
          </h2>


          <form
            onSubmit={handleLogin}
          >


            {/* EMAIL */}

            <div className="input-box">

              <FaEnvelope />

              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) =>
                  setEmail(
                    e.target.value
                  )
                }
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
                placeholder="Password"
                value={password}
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }
              />

              <FaEye
                className="eye"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
              />

            </div>


            {/* OPTIONS */}

            <div className="login-options">

              <label>

                <input
                  type="checkbox"
                />

                Remember Me

              </label>


              <a href="#">
                Forgot Password?
              </a>

            </div>


            {/* LOGIN BUTTON */}

            <button
              type="submit"
              className="login-btn2"
              disabled={loading}
            >

              {loading
                ? "Logging in..."
                : "Login"}

            </button>


            {/* DIVIDER */}

            <div className="google-divider">

              <span>
                OR
              </span>

            </div>


            {/* GOOGLE BUTTON */}

            <div
              ref={googleButtonRef}
              className="google-login-container"
            />


            {/* REGISTER */}

            <p className="register-text">

              Don't have an account?

              {" "}

              <Link to="/register">
                Register
              </Link>

            </p>


          </form>

        </div>

      </div>

    </div>
  );
}


export default Login;