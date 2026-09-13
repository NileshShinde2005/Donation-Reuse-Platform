import { useState } from "react";
import { toast } from "react-toastify";
import "./Donate.css";

const Donate = () => {

  const user =
    JSON.parse(localStorage.getItem("user")) || {};

  const selectedNGO =
    JSON.parse(localStorage.getItem("selectedNGO")) || null;

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    condition: "",
    location: "",
    description: "",
    pickup: false,
    pickupDate: "",
    pickupTime: "",
    pickupAddress: "",
  });

  const [preview, setPreview] = useState(null);

  // =========================
  // HANDLE INPUT
  // =========================

  const handleChange = (e) => {

    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setFormData({
      ...formData,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    });
  };

  // =========================
  // IMAGE
  // =========================

  const handleImage = (e) => {

    const file = e.target.files[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      setPreview(reader.result);
    };

    reader.readAsDataURL(file);
  };

  // =========================
  // SUBMIT
  // =========================

  const handleSubmit = async (e) => {

    e.preventDefault();

    // -------------------------
    // BASIC VALIDATION
    // -------------------------

    if (
      !formData.title ||
      !formData.category ||
      !formData.condition ||
      !formData.location ||
      !formData.description ||
      !preview
    ) {

      toast.error(
        "Please fill all required fields."
      );

      return;
    }

    // -------------------------
    // PICKUP VALIDATION
    // -------------------------

    if (formData.pickup) {

      if (
        !selectedNGO ||
        !formData.pickupDate ||
        !formData.pickupTime ||
        !formData.pickupAddress
      ) {

        toast.error(
          "Please select an organization and complete pickup details."
        );

        return;
      }
    }

    // -------------------------
    // CREATE DONATION
    // -------------------------

    const donation = {

      title: formData.title,

      category: formData.category,

      itemCondition: formData.condition,

      location: formData.location,

      description: formData.description,

      pickup: formData.pickup,

      image: preview,

      donorName:
        user.name || "Unknown User",

      donatedBy:
        user.email || "",

      createdAt:
        new Date().toISOString(),

      // =========================
      // NGO
      // =========================

      ngoId:
        formData.pickup
          ? selectedNGO?.id
          : null,

      ngoName:
        formData.pickup
          ? selectedNGO?.name
          : null,

      // =========================
      // PICKUP
      // =========================

      pickupDate:
        formData.pickup
          ? formData.pickupDate
          : null,

      pickupTime:
        formData.pickup
          ? formData.pickupTime
          : null,

      pickupAddress:
        formData.pickup
          ? formData.pickupAddress
          : null,

      // =========================
      // STATUS
      // =========================

      status:
        formData.pickup
          ? "SCHEDULED"
          : "AVAILABLE",
    };

    try {

      const response =
        await fetch(
          "http://localhost:8080/api/donations",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify(donation),
          }
        );

      if (!response.ok) {

        throw new Error(
          "Failed to create donation"
        );
      }

      await response.json();

      toast.success(
        "Donation added successfully! 🎉"
      );

      // -------------------------
      // RESET FORM
      // -------------------------

      setFormData({
        title: "",
        category: "",
        condition: "",
        location: "",
        description: "",
        pickup: false,
        pickupDate: "",
        pickupTime: "",
        pickupAddress: "",
      });

      setPreview(null);

      // Remove selected NGO after successful donation

      localStorage.removeItem(
        "selectedNGO"
      );

    } catch (error) {

      console.error(
        "Donation Error:",
        error
      );

      toast.error(
        "Failed to save donation. Please try again."
      );
    }
  };

  // =========================
  // UI
  // =========================

  return (
    <div className="donate-page">

      <div className="donate-container">

        <h1>
          Donate an Item ❤️
        </h1>

        <p>
          Give your unused items a second
          life and help someone in need.
        </p>

        <form onSubmit={handleSubmit}>

          {/* =========================
              IMAGE
          ========================= */}

          <div className="image-upload">

            <label>
              Upload Image
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={handleImage}
            />

            {preview && (

              <img
                src={preview}
                alt="Preview"
                className="preview"
              />

            )}

          </div>

          {/* =========================
              ITEM NAME
          ========================= */}

          <input
            type="text"
            placeholder="Item Name"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />

          {/* =========================
              CATEGORY
          ========================= */}

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
          >

            <option value="">
              Select Category
            </option>

            <option value="Clothes">
              Clothes
            </option>

            <option value="Books">
              Books
            </option>

            <option value="Electronics">
              Electronics
            </option>

            <option value="Furniture">
              Furniture
            </option>

            <option value="Toys">
              Toys
            </option>

            <option value="Others">
              Others
            </option>

          </select>

          {/* =========================
              CONDITION
          ========================= */}

          <select
            name="condition"
            value={formData.condition}
            onChange={handleChange}
          >

            <option value="">
              Item Condition
            </option>

            <option value="New">
              New
            </option>

            <option value="Like New">
              Like New
            </option>

            <option value="Good">
              Good
            </option>

            <option value="Used">
              Used
            </option>

          </select>

          {/* =========================
              LOCATION
          ========================= */}

          <input
            type="text"
            placeholder="Location"
            name="location"
            value={formData.location}
            onChange={handleChange}
          />

          {/* =========================
              DESCRIPTION
          ========================= */}

          <textarea
            rows="5"
            placeholder="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />

          {/* =========================
              PICKUP
          ========================= */}

          <div className="checkbox">

            <input
              type="checkbox"
              name="pickup"
              checked={formData.pickup}
              onChange={handleChange}
            />

            <label>
              Pickup Available
            </label>

          </div>

          {/* =========================
              SELECTED NGO
          ========================= */}

          {formData.pickup && (

            <div className="pickup-section">

              <h3>
                Pickup & Collection
              </h3>

              {selectedNGO ? (

                <div className="selected-ngo">

                  <strong>
                    Selected Organization
                  </strong>

                  <p>
                    {selectedNGO.name}
                  </p>

                  <span>
                    {selectedNGO.type} •{" "}
                    {selectedNGO.city}
                  </span>

                </div>

              ) : (

                <div className="no-ngo">

                  <p>
                    No organization selected.
                  </p>

                  <a href="/ngos">
                    Select a verified NGO
                  </a>

                </div>

              )}

              {/* PICKUP DATE */}

              <label>
                Pickup Date
              </label>

              <input
                type="date"
                name="pickupDate"
                value={formData.pickupDate}
                onChange={handleChange}
                min={
                  new Date()
                    .toISOString()
                    .split("T")[0]
                }
              />

              {/* PICKUP TIME */}

              <label>
                Pickup Time
              </label>

              <input
                type="time"
                name="pickupTime"
                value={formData.pickupTime}
                onChange={handleChange}
              />

              {/* PICKUP ADDRESS */}

              <label>
                Pickup Address
              </label>

              <textarea
                rows="3"
                name="pickupAddress"
                placeholder="Enter complete pickup address"
                value={
                  formData.pickupAddress
                }
                onChange={handleChange}
              />

            </div>

          )}

          {/* =========================
              SUBMIT
          ========================= */}

          <button type="submit">
            Donate Item
          </button>

        </form>

      </div>

    </div>
  );
};

export default Donate;