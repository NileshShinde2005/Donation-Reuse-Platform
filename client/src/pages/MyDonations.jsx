import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import {
  FaSearch,
  FaEdit,
  FaTrash,
  FaMapMarkerAlt,
  FaBoxOpen,
  FaTimes,
  FaSave,
} from "react-icons/fa";

import "./MyDonations.css";

function MyDonations() {
  // ================================
  // LOGGED-IN USER
  // ================================

  const user =
    JSON.parse(localStorage.getItem("user")) || null;

  // ================================
  // STATES
  // ================================

  const [donations, setDonations] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [editingDonation, setEditingDonation] =
    useState(null);

  const [editData, setEditData] =
    useState({
      title: "",
      category: "",
      condition: "",
      location: "",
      description: "",
      pickup: false,
    });

  const [editImage, setEditImage] =
    useState(null);

  const [saving, setSaving] =
    useState(false);

  const [deletingId, setDeletingId] =
    useState(null);

  // ================================
  // FETCH MY DONATIONS
  // ================================

  useEffect(() => {

    const fetchMyDonations = async () => {

      if (!user?.email) {
        setLoading(false);
        return;
      }

      try {

        const response =
          await fetch(
            `https://donation-reuse-platform.onrender.com/api/donations/user/${encodeURIComponent(
              user.email
            )}`
          );

        if (!response.ok) {
          throw new Error(
            "Failed to fetch donations"
          );
        }

        const data =
          await response.json();

        setDonations(data);

      } catch (error) {

        console.error(
          "My Donations Error:",
          error
        );

        toast.error(
          "Unable to load your donations."
        );

      } finally {

        setLoading(false);
      }
    };

    fetchMyDonations();

  }, [user?.email]);

  // ================================
  // DELETE DONATION
  // ================================

  const handleDelete = async (id) => {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this donation?"
      );

    if (!confirmDelete) {
      return;
    }

    setDeletingId(id);

    try {

      const response =
        await fetch(
          `https://donation-reuse-platform.onrender.com/api/donations/${id}`,
          {
            method: "DELETE",
          }
        );

      if (!response.ok) {

        const message =
          await response.text();

        throw new Error(
          message ||
            "Failed to delete donation"
        );
      }

      // Remove from current UI

      setDonations(
        (previousDonations) =>
          previousDonations.filter(
            (donation) =>
              donation.id !== id
          )
      );

      toast.success(
        "Donation deleted successfully!"
      );

    } catch (error) {

      console.error(
        "Delete Donation Error:",
        error
      );

      toast.error(
        error.message ||
          "Unable to delete donation."
      );

    } finally {

      setDeletingId(null);
    }
  };

  // ================================
  // OPEN EDIT FORM
  // ================================

  const handleEdit = (donation) => {

    setEditingDonation(donation);

    setEditData({
      title: donation.title || "",

      category:
        donation.category || "",

      condition:
        donation.itemCondition || "",

      location:
        donation.location || "",

      description:
        donation.description || "",

      pickup:
        donation.pickup || false,
    });

    setEditImage(
      donation.image || null
    );
  };

  // ================================
  // HANDLE EDIT INPUT
  // ================================

  const handleEditChange = (e) => {

    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setEditData({
      ...editData,

      [name]:
        type === "checkbox"
          ? checked
          : value,
    });
  };

  // ================================
  // HANDLE EDIT IMAGE
  // ================================

  const handleEditImage = (e) => {

    const file =
      e.target.files[0];

    if (!file) {
      return;
    }

    const reader =
      new FileReader();

    reader.onloadend = () => {

      setEditImage(
        reader.result
      );
    };

    reader.readAsDataURL(file);
  };

  // ================================
  // UPDATE DONATION
  // ================================

  const handleUpdate = async (e) => {

    e.preventDefault();

    if (
      !editData.title ||
      !editData.category ||
      !editData.condition ||
      !editData.location ||
      !editData.description
    ) {

      toast.error(
        "Please fill all fields."
      );

      return;
    }

    if (!editingDonation) {
      return;
    }

    setSaving(true);

    try {

      const updatedDonation = {

        title:
          editData.title,

        category:
          editData.category,

        itemCondition:
          editData.condition,

        location:
          editData.location,

        description:
          editData.description,

        pickup:
          editData.pickup,

        image:
          editImage || null,
      };

      const response =
        await fetch(
          `https://donation-reuse-platform.onrender.com/api/donations/${editingDonation.id}`,
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify(
                updatedDonation
              ),
          }
        );

      if (!response.ok) {

        const message =
          await response.text();

        throw new Error(
          message ||
            "Failed to update donation"
        );
      }

      const updatedDonationFromServer =
        await response.json();

      // ================================
      // UPDATE UI
      // ================================

      setDonations(
        (previousDonations) =>
          previousDonations.map(
            (donation) =>
              donation.id ===
              editingDonation.id
                ? updatedDonationFromServer
                : donation
          )
      );

      setEditingDonation(null);

      toast.success(
        "Donation updated successfully!"
      );

    } catch (error) {

      console.error(
        "Update Donation Error:",
        error
      );

      toast.error(
        error.message ||
          "Unable to update donation."
      );

    } finally {

      setSaving(false);
    }
  };

  // ================================
  // SEARCH
  // ================================

  const filteredDonations =
    donations.filter(
      (donation) =>
        (donation.title || "")
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );

  // ================================
  // LOADING
  // ================================

  if (loading) {

    return (
      <div className="my-donations-page">

        <div className="empty-donations">

          <FaBoxOpen />

          <h2>
            Loading Your Donations...
          </h2>

          <p>
            Please wait while we load your donations.
          </p>

        </div>

      </div>
    );
  }

  // ================================
  // UI
  // ================================

  return (
    <div className="my-donations-page">

      {/* ================================
          HEADER
      ================================= */}

      <div className="my-donations-header">

        <div>

          <h1>
            My Donations ❤️
          </h1>

          <p>
            Manage the items you have donated.
          </p>

        </div>

        <div className="donation-count">

          <FaBoxOpen />

          <span>
            {donations.length} Donations
          </span>

        </div>

      </div>

      {/* ================================
          SEARCH
      ================================= */}

      <div className="my-donations-search">

        <FaSearch />

        <input
          type="text"
          placeholder="Search your donations..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

      </div>

      {/* ================================
          DONATIONS
      ================================= */}

      {filteredDonations.length === 0 ? (

        <div className="empty-donations">

          <FaBoxOpen />

          <h2>
            No Donations Found
          </h2>

          <p>
            {donations.length === 0
              ? "You haven't donated any items yet."
              : "No donation matches your search."}
          </p>

        </div>

      ) : (

        <div className="my-donations-grid">

          {filteredDonations.map(
            (donation) => (

              <div
                className="my-donation-card"
                key={donation.id}
              >

                {/* IMAGE */}

                <div className="my-donation-image">

                  {donation.image ? (

                    <img
                      src={donation.image}
                      alt={donation.title}
                    />

                  ) : (

                    <FaBoxOpen />

                  )}

                  <span className="condition-badge">

                    {donation.itemCondition}

                  </span>

                </div>

                {/* CONTENT */}

                <div className="my-donation-content">

                  <h2>
                    {donation.title}
                  </h2>

                  <span className="category-badge">

                    {donation.category}

                  </span>

                  <span
                    className={`status-badge ${
                      donation.status
                      ? donation.status.toLowerCase()
                      : "available"
                      }`}
                      >
                       {donation.status || "AVAILABLE"}
                  </span>
                  
                  <p>

                    <FaMapMarkerAlt />

                    {donation.location}

                  </p>

                  <p className="donation-description">

                    {donation.description}

                  </p>

                  {/* ACTIONS */}

                  <div className="donation-actions">

                    <button
                      className="edit-donation-btn"
                      onClick={() =>
                        handleEdit(
                          donation
                        )
                      }
                    >

                      <FaEdit />

                      Edit

                    </button>

                    <button
                      className="delete-donation-btn"
                      disabled={
                        deletingId ===
                        donation.id
                      }
                      onClick={() =>
                        handleDelete(
                          donation.id
                        )
                      }
                    >

                      <FaTrash />

                      {deletingId ===
                      donation.id
                        ? "Deleting..."
                        : "Delete"}

                    </button>

                  </div>

                </div>

              </div>
            )
          )}

        </div>

      )}

      {/* ================================
          EDIT MODAL
      ================================= */}

      {editingDonation && (

        <div className="edit-modal-overlay">

          <div className="edit-modal">

            {/* MODAL HEADER */}

            <div className="edit-modal-header">

              <div>

                <h2>
                  Edit Donation
                </h2>

                <p>
                  Update your donation details
                </p>

              </div>

              <button
                className="close-edit-btn"
                onClick={() =>
                  setEditingDonation(
                    null
                  )
                }
                disabled={saving}
              >

                <FaTimes />

              </button>

            </div>

            {/* EDIT FORM */}

            <form
              onSubmit={handleUpdate}
            >

              {/* IMAGE */}

              <div className="edit-image-section">

                {editImage && (

                  <img
                    src={editImage}
                    alt="Donation preview"
                    className="edit-preview"
                  />

                )}

                <label>
                  Change Image
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={
                    handleEditImage
                  }
                />

              </div>

              {/* ITEM NAME */}

              <div className="edit-form-group">

                <label>
                  Item Name
                </label>

                <input
                  type="text"
                  name="title"
                  value={
                    editData.title
                  }
                  onChange={
                    handleEditChange
                  }
                />

              </div>

              {/* CATEGORY + CONDITION */}

              <div className="edit-form-row">

                <div className="edit-form-group">

                  <label>
                    Category
                  </label>

                  <select
                    name="category"
                    value={
                      editData.category
                    }
                    onChange={
                      handleEditChange
                    }
                  >

                    <option value="">
                      Select Category
                    </option>

                    <option>
                      Clothes
                    </option>

                    <option>
                      Books
                    </option>

                    <option>
                      Electronics
                    </option>

                    <option>
                      Furniture
                    </option>

                    <option>
                      Toys
                    </option>

                    <option>
                      Others
                    </option>

                  </select>

                </div>

                <div className="edit-form-group">

                  <label>
                    Condition
                  </label>

                  <select
                    name="condition"
                    value={
                      editData.condition
                    }
                    onChange={
                      handleEditChange
                    }
                  >

                    <option value="">
                      Select Condition
                    </option>

                    <option>
                      New
                    </option>

                    <option>
                      Like New
                    </option>

                    <option>
                      Good
                    </option>

                    <option>
                      Used
                    </option>

                  </select>

                </div>

              </div>

              {/* LOCATION */}

              <div className="edit-form-group">

                <label>
                  Location
                </label>

                <input
                  type="text"
                  name="location"
                  value={
                    editData.location
                  }
                  onChange={
                    handleEditChange
                  }
                />

              </div>

              {/* DESCRIPTION */}

              <div className="edit-form-group">

                <label>
                  Description
                </label>

                <textarea
                  name="description"
                  rows="4"
                  value={
                    editData.description
                  }
                  onChange={
                    handleEditChange
                  }
                />

              </div>

              {/* PICKUP */}

              <div className="edit-pickup">

                <input
                  type="checkbox"
                  name="pickup"
                  checked={
                    editData.pickup
                  }
                  onChange={
                    handleEditChange
                  }
                />

                <label>
                  Pickup Available
                </label>

              </div>

              {/* BUTTONS */}

              <div className="edit-modal-actions">

                <button
                  type="button"
                  className="cancel-edit-btn"
                  onClick={() =>
                    setEditingDonation(
                      null
                    )
                  }
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-edit-btn"
                  disabled={saving}
                >

                  <FaSave />

                  {saving
                    ? "Updating..."
                    : "Update Donation"}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default MyDonations;