import "./Profile.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import {
  FaUserCircle,
  FaEnvelope,
  FaCalendarAlt,
  FaDonate,
  FaSignOutAlt,
  FaUserEdit,
  FaPhone,
  FaSave,
  FaTimes,
} from "react-icons/fa";

import { toast } from "react-toastify";

function Profile() {
  const navigate = useNavigate();

  // =========================
  // LOGGED-IN USER
  // =========================

  const storedUser =
    JSON.parse(
      localStorage.getItem("user")
    ) || {};

  // =========================
  // STATES
  // =========================

  const [user, setUser] =
    useState(storedUser);

  const [donations, setDonations] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [editing, setEditing] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [formData, setFormData] =
    useState({
      name: storedUser.name || "",
      phone: storedUser.phone || "",
    });

  // =========================
  // FETCH PROFILE
  // =========================

  useEffect(() => {

    const fetchProfile = async () => {

      if (!storedUser.id) {
        setLoading(false);
        return;
      }

      try {

        // =========================
        // GET USER
        // =========================

        const userResponse =
          await fetch(
            `https://donation-reuse-platform.onrender.com/api/users/${storedUser.id}`
          );

        if (!userResponse.ok) {

          throw new Error(
            "Failed to fetch profile"
          );
        }

        const userData =
          await userResponse.json();

        setUser(userData);

        setFormData({
          name: userData.name || "",
          phone: userData.phone || "",
        });

        // =========================
        // GET DONATIONS
        // =========================

        const donationsResponse =
          await fetch(
            "https://donation-reuse-platform.onrender.com/api/donations"
          );

        if (!donationsResponse.ok) {

          throw new Error(
            "Failed to fetch donations"
          );
        }

        const donationsData =
          await donationsResponse.json();

        // Only this user's donations

        const myDonations =
          donationsData.filter(
            (donation) =>
              donation.donatedBy ===
              userData.email
          );

        setDonations(
          myDonations
        );

        // =========================
        // UPDATE LOCAL USER
        // =========================

        const localUser = {
          ...storedUser,
          ...userData,
          password: undefined,
        };

        localStorage.setItem(
          "user",
          JSON.stringify(localUser)
        );

      } catch (error) {

        console.error(
          "Profile Error:",
          error
        );

        toast.error(
          "Unable to load profile."
        );

      } finally {

        setLoading(false);
      }
    };

    fetchProfile();

  }, [storedUser.id]);

  // =========================
  // INPUT CHANGE
  // =========================

  const handleChange = (e) => {

    const {
      name,
      value,
    } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // =========================
  // EDIT PROFILE
  // =========================

  const handleEdit = () => {

    setFormData({
      name: user.name || "",
      phone: user.phone || "",
    });

    setEditing(true);
  };

  // =========================
  // CANCEL EDIT
  // =========================

  const handleCancel = () => {

    setFormData({
      name: user.name || "",
      phone: user.phone || "",
    });

    setEditing(false);
  };

  // =========================
  // SAVE PROFILE
  // =========================

  const handleSave = async () => {

    if (!formData.name.trim()) {

      toast.error(
        "Name cannot be empty."
      );

      return;
    }

    if (!formData.phone.trim()) {

      toast.error(
        "Phone number cannot be empty."
      );

      return;
    }

    if (
      !/^[0-9]{10}$/.test(
        formData.phone.trim()
      )
    ) {

      toast.error(
        "Please enter a valid 10-digit phone number."
      );

      return;
    }

    setSaving(true);

    try {

      const response =
        await fetch(
          `https://donation-reuse-platform.onrender.com/api/users/${user.id}`,
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              name:
                formData.name.trim(),

              phone:
                formData.phone.trim(),
            }),
          }
        );

      if (!response.ok) {

        const message =
          await response.text();

        throw new Error(
          message ||
            "Failed to update profile"
        );
      }

      const updatedUser =
        await response.json();

      // =========================
      // UPDATE STATE
      // =========================

      setUser(updatedUser);

      setFormData({
        name:
          updatedUser.name || "",

        phone:
          updatedUser.phone || "",
      });

      setEditing(false);

      // =========================
      // UPDATE LOCAL STORAGE
      // =========================

      const updatedLocalUser = {
        ...storedUser,
        ...updatedUser,
      };

      delete updatedLocalUser.password;

      localStorage.setItem(
        "user",
        JSON.stringify(
          updatedLocalUser
        )
      );

      toast.success(
        "Profile updated successfully! 🎉"
      );

    } catch (error) {

      console.error(
        "Update Profile Error:",
        error
      );

      toast.error(
        error.message ||
          "Unable to update profile."
      );

    } finally {

      setSaving(false);
    }
  };

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {

    localStorage.removeItem("user");

    navigate("/");

    window.location.reload();
  };

  // =========================
  // MEMBER SINCE
  // =========================

  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString()
    : "Not Available";

  // =========================
  // LOADING
  // =========================

  if (loading) {

    return (
      <div className="profile-page">

        <div className="profile-card">

          <h2>
            Loading Profile...
          </h2>

        </div>

      </div>
    );
  }

  // =========================
  // UI
  // =========================

  return (
    <div className="profile-page">

      <div className="profile-card">

        {/* =========================
            PROFILE ICON
        ========================= */}

        <FaUserCircle
          className="profile-avatar"
        />

        {/* =========================
            NAME
        ========================= */}

        {!editing ? (

          <h1>
            {user.name || "User"}
          </h1>

        ) : (

          <input
            className="profile-edit-input"
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
          />

        )}

        {/* =========================
            PROFILE INFO
        ========================= */}

        <div className="profile-info">

          {/* EMAIL */}

          <div className="info-item">

            <FaEnvelope />

            <span>
              {user.email ||
                "Not Available"}
            </span>

          </div>

          {/* PHONE */}

          <div className="info-item">

            <FaPhone />

            {editing ? (

              <input
                className="profile-edit-field"
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={
                  formData.phone
                }
                onChange={
                  handleChange
                }
                maxLength="10"
              />

            ) : (

              <span>
                {user.phone ||
                  "Not Available"}
              </span>

            )}

          </div>

          {/* MEMBER SINCE */}

          <div className="info-item">

            <FaCalendarAlt />

            <span>
              Member Since:{" "}
              {memberSince}
            </span>

          </div>

          {/* DONATIONS */}

          <div className="info-item">

            <FaDonate />

            <span>
              Total Donations:{" "}
              {donations.length}
            </span>

          </div>

        </div>

        {/* =========================
            BUTTONS
        ========================= */}

        <div className="profile-buttons">

          {!editing ? (

            <button
              className="edit-btn"
              onClick={handleEdit}
            >

              <FaUserEdit />

              Edit Profile

            </button>

          ) : (

            <>

              <button
                className="edit-btn"
                onClick={handleSave}
                disabled={saving}
              >

                <FaSave />

                {saving
                  ? "Saving..."
                  : "Save Changes"}

              </button>

              <button
                className="logout-btn-profile"
                onClick={handleCancel}
                disabled={saving}
              >

                <FaTimes />

                Cancel

              </button>

            </>

          )}

          {!editing && (

            <button
              className="logout-btn-profile"
              onClick={handleLogout}
            >

              <FaSignOutAlt />

              Logout

            </button>

          )}

        </div>

      </div>

    </div>
  );
}

export default Profile;