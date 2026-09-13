import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import {
  FaArrowLeft,
  FaMapMarkerAlt,
  FaBoxOpen,
  FaUser,
  FaTruck,
  FaHeart,
  FaTimes,
  FaCheck,
} from "react-icons/fa";

import "./DonationDetails.css";

function DonationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  // =========================
  // GET LOGGED-IN USER
  // =========================

  const user =
    JSON.parse(localStorage.getItem("user")) || null;

  // =========================
  // STATES
  // =========================

  const [donation, setDonation] = useState(null);

  const [loading, setLoading] =
    useState(true);

  const [requested, setRequested] =
    useState(false);

  const [showConfirm, setShowConfirm] =
    useState(false);

  const [requestLoading, setRequestLoading] =
    useState(false);

  // =========================
  // FETCH DONATION
  // =========================

  useEffect(() => {
    const fetchDonation = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/donations/${id}`
        );

        if (!response.ok) {
          setDonation(null);
          return;
        }

        const data =
          await response.json();

        setDonation(data);

      } catch (error) {

        console.error(
          "Error fetching donation:",
          error
        );

        toast.error(
          "Unable to load donation."
        );

        setDonation(null);

      } finally {

        setLoading(false);
      }
    };

    fetchDonation();

  }, [id]);

  // =========================
  // CHECK EXISTING REQUEST
  // =========================

  useEffect(() => {

    const checkExistingRequest =
      async () => {

        if (!user?.email) {
          setRequested(false);
          return;
        }

        try {

          const response = await fetch(
            `http://localhost:8080/api/requests/user/${encodeURIComponent(
              user.email
            )}`
          );

          if (!response.ok) {
            return;
          }

          const requests =
            await response.json();

          const alreadyExists =
            requests.some(
              (request) =>
                String(
                  request.donationId
                ) === String(id)
            );

          setRequested(alreadyExists);

        } catch (error) {

          console.error(
            "Error checking request:",
            error
          );
        }
      };

    checkExistingRequest();

  }, [id, user?.email]);

  // =========================
  // LOADING
  // =========================

  if (loading) {

    return (
      <div className="donation-not-found">

        <FaBoxOpen />

        <h2>
          Loading Donation...
        </h2>

        <p>
          Please wait while we load the donation.
        </p>

      </div>
    );
  }

  // =========================
  // DONATION NOT FOUND
  // =========================

  if (!donation) {

    return (
      <div className="donation-not-found">

        <FaBoxOpen />

        <h2>
          Donation Not Found
        </h2>

        <p>
          This donation may have been removed
          or is no longer available.
        </p>

        <button
          onClick={() =>
            navigate("/browse")
          }
        >
          Back to Browse
        </button>

      </div>
    );
  }

  // =========================
  // CHECK OWN DONATION
  // =========================

  const isOwnDonation =
    user &&
    donation.donatedBy &&
    donation.donatedBy === user.email;

  // =========================
  // OPEN REQUEST CONFIRMATION
  // =========================

  const handleRequestClick = () => {

    // User not logged in

    if (!user || !user.email) {

      toast.info(
        "Please login to request an item."
      );

      navigate("/login");

      return;
    }

    // Own donation

    if (isOwnDonation) {

      toast.warning(
        "You cannot request your own donation."
      );

      return;
    }

    // Already requested

    if (requested) {

      toast.info(
        "You have already requested this item."
      );

      return;
    }

    setShowConfirm(true);
  };

  // =========================
  // CANCEL REQUEST
  // =========================

  const handleCancelRequest = () => {

    if (requestLoading) {
      return;
    }

    setShowConfirm(false);
  };

  // =========================
  // CONFIRM REQUEST
  // =========================

  const handleConfirmRequest = async () => {

    // Safety check

    if (!user || !user.email) {

      toast.info(
        "Please login to request an item."
      );

      navigate("/login");

      return;
    }

    // Own donation

    if (isOwnDonation) {

      toast.warning(
        "You cannot request your own donation."
      );

      setShowConfirm(false);

      return;
    }

    // Already requested

    if (requested) {

      toast.info(
        "You have already requested this item."
      );

      setShowConfirm(false);

      return;
    }

    // =========================
    // START REQUEST
    // =========================

    setRequestLoading(true);

    try {

      // =========================
      // REQUEST DATA
      // =========================

      const newRequest = {

        donationId:
          donation.id,

        itemTitle:
          donation.title,

        category:
          donation.category,

        location:
          donation.location,

        image:
          donation.image || null,

        description:
          donation.description || "",

        donorEmail:
          donation.donatedBy ||
          "Anonymous Donor",

        requestedBy:
          user.email,

        requestedByName:
          user.name ||
          user.username ||
          "User",

        requestedAt:
          new Date().toISOString(),

        status:
          "Pending",
      };

      // =========================
      // SEND TO BACKEND
      // =========================

      const response =
        await fetch(
          "http://localhost:8080/api/requests",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify(
                newRequest
              ),
          }
        );

      // =========================
      // HANDLE DUPLICATE
      // =========================

      if (response.status === 409) {

        const message =
          await response.text();

        setRequested(true);

        setShowConfirm(false);

        toast.info(
          message ||
            "You have already requested this item."
        );

        return;
      }

      // =========================
      // HANDLE OTHER ERRORS
      // =========================

      if (!response.ok) {

        throw new Error(
          "Failed to create request"
        );
      }

      // =========================
      // SUCCESS
      // =========================

      const savedRequest =
        await response.json();

      console.log(
        "Request saved:",
        savedRequest
      );

      setRequested(true);

      setShowConfirm(false);

      toast.success(
        "Request sent successfully! ❤️"
      );

    } catch (error) {

      console.error(
        "Request Error:",
        error
      );

      toast.error(
        "Unable to send request. Please try again."
      );

    } finally {

      setRequestLoading(false);
    }
  };

  // =========================
  // UI
  // =========================

  return (
    <div className="donation-details-page">

      <div className="donation-details-container">

        {/* =========================
            BACK BUTTON
        ========================= */}

        <button
          className="back-btn"
          onClick={() =>
            navigate("/browse")
          }
        >
          <FaArrowLeft />

          Back to Browse
        </button>

        {/* =========================
            MAIN CARD
        ========================= */}

        <div className="donation-details-card">

          {/* IMAGE */}

          <div className="donation-details-image">

            {donation.image ? (

              <img
                src={donation.image}
                alt={donation.title}
              />

            ) : (

              <div className="no-image">

                <FaBoxOpen />

                <span>
                  No Image Available
                </span>

              </div>

            )}

          </div>

          {/* INFORMATION */}

          <div className="donation-details-info">

            <span className="details-category">
              {donation.category}
            </span>

            <h1>
              {donation.title}
            </h1>

            <p className="details-description">
              {donation.description}
            </p>

            {/* =========================
                DETAILS
            ========================= */}

            <div className="details-list">

              {/* CONDITION */}

              <div className="detail-item">

                <FaBoxOpen />

                <div>

                  <span>
                    Condition
                  </span>

                  <strong>
                    {donation.itemCondition}
                  </strong>

                </div>

              </div>

              {/* LOCATION */}

              <div className="detail-item">

                <FaMapMarkerAlt />

                <div>

                  <span>
                    Location
                  </span>

                  <strong>
                    {donation.location}
                  </strong>

                </div>

              </div>

              {/* DONOR */}

              <div className="detail-item">

                <FaUser />

                <div>

                  <span>
                    Donated By
                  </span>

                  <strong>
                    {donation.donatedBy ||
                      "Anonymous Donor"}
                  </strong>

                </div>

              </div>

              {/* PICKUP */}

              <div className="detail-item">

                <FaTruck />

                <div>

                  <span>
                    Pickup
                  </span>

                  <strong>
                    {donation.pickup
                      ? "Pickup Available"
                      : "Pickup Not Available"}
                  </strong>

                </div>

              </div>

            </div>

            {/* =========================
                REQUEST SECTION
            ========================= */}

            <div className="request-section">

              {/* OWN DONATION */}

              {isOwnDonation ? (

                <div className="own-donation-message">

                  <FaBoxOpen />

                  <span>
                    This is your donation
                  </span>

                </div>

              ) : requested ? (

                /* REQUEST ALREADY SENT */

                <div className="request-success">

                  <FaCheck />

                  Request Sent Successfully

                </div>

              ) : (

                /* REQUEST BUTTON */

                <button
                  className="request-btn"
                  onClick={
                    handleRequestClick
                  }
                >

                  <FaHeart />

                  Request This Item

                </button>

              )}

              <p>
                By requesting this item, you agree
                to coordinate with the donor for
                collection.
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* =========================
          CONFIRMATION MODAL
      ========================= */}

      {showConfirm && (

        <div className="request-modal-overlay">

          <div className="request-modal">

            {/* CLOSE */}

            <button
              className="modal-close"
              onClick={
                handleCancelRequest
              }
              disabled={requestLoading}
            >
              <FaTimes />
            </button>

            {/* ICON */}

            <div className="modal-icon">

              <FaHeart />

            </div>

            <h2>
              Request This Item?
            </h2>

            <p>
              Are you sure you want to request{" "}
              <strong>
                "{donation.title}"
              </strong>{" "}
              from the donor?
            </p>

            {/* BUTTONS */}

            <div className="modal-buttons">

              <button
                className="cancel-btn"
                onClick={
                  handleCancelRequest
                }
                disabled={requestLoading}
              >
                Cancel
              </button>

              <button
                className="confirm-btn"
                onClick={
                  handleConfirmRequest
                }
                disabled={requestLoading}
              >

                {requestLoading ? (

                  "Sending..."

                ) : (

                  <>
                    <FaCheck />

                    Confirm Request
                  </>

                )}

              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default DonationDetails;