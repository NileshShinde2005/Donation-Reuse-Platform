import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Donate from "./pages/Donate";
import Browse from "./pages/Browse";
import Profile from "./pages/Profile";
import MyDonations from "./pages/MyDonations";
import DonationDetails from "./pages/DonationDetails";
import PublicRoute from "./components/PublicRoute";
import NGOs from "./pages/NGOs";
import Requests from "./pages/Requests";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <>
      <Navbar />

      <Routes>

        {/* Public Pages */}
        <Route path="/" element={<Home />} />

        <Route
          path="/login"
            element={
            <PublicRoute>
            <Login />
            </PublicRoute>
         }
        />

        <Route
          path="/register"
            element={
            <PublicRoute>
            <Register />
            </PublicRoute>
        }
        />

        {/* Protected Pages */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/donate"
          element={
            <ProtectedRoute>
              <Donate />
            </ProtectedRoute>
          }
        />

        <Route
          path="/browse"
          element={
            <ProtectedRoute>
              <Browse />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-donations"
          element={
            <ProtectedRoute>
              <MyDonations />
            </ProtectedRoute>
          }
        />

        <Route
          path="/donation/:id"
          element={
            <ProtectedRoute>
              <DonationDetails />
            </ProtectedRoute>
         }
      />
      
        <Route
          path="/ngos"
          element={
            <ProtectedRoute>
              <NGOs />
            </ProtectedRoute>
         }
      />
        <Route
          path="/requests"
          element={
            <ProtectedRoute>
              <Requests />
            </ProtectedRoute>
        }
      />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
        }
      />
      </Routes>
    </>
  );
}

export default App;