import "./Dashboard.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import {
  FaHandHoldingHeart,
  FaBoxOpen,
  FaUser,
  FaDonate,
  FaCheck,
  FaTimes,
  FaClock,
  FaHeart,
} from "react-icons/fa";

import { toast } from "react-toastify";

function Dashboard() {
  const navigate = useNavigate();

  // =========================
  // GET LOGGED-IN USER
  // =========================

  const user =
    JSON.parse(localStorage.getItem("user")) || {};

  // =========================
  // STATES
  // =========================

  const [allDonations, setAllDonations] =
    useState([]);

  const [requests, setRequests] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [updatingRequest, setUpdatingRequest] =
    useState(null);

  // =========================
  // FETCH DASHBOARD DATA
  // =========================

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user.email) {
        setLoading(false);
        return;
      }

      try {
        // =========================
        // FETCH DONATIONS
        // =========================

        const donationsResponse =
          await fetch(
            "http://localhost:8080/api/donations"
          );

        if (!donationsResponse.ok) {
          throw new Error(
            "Failed to fetch donations"
          );
        }

        const donationsData =
          await donationsResponse.json();

        setAllDonations(donationsData);

        // =========================
        // FETCH MY REQUESTS
        // =========================

        const myRequestsResponse =
          await fetch(
            `http://localhost:8080/api/requests/user/${encodeURIComponent(
              user.email
            )}`
          );

        if (!myRequestsResponse.ok) {
          throw new Error(
            "Failed to fetch my requests"
          );
        }

        const myRequestsData =
          await myRequestsResponse.json();

        // =========================
        // FETCH INCOMING REQUESTS
        // =========================

        const incomingRequestsResponse =
          await fetch(
            `http://localhost:8080/api/requests/donor/${encodeURIComponent(
              user.email
            )}`
          );

        if (!incomingRequestsResponse.ok) {
          throw new Error(
            "Failed to fetch incoming requests"
          );
        }

        const incomingRequestsData =
          await incomingRequestsResponse.json();

        // =========================
        // COMBINE REQUESTS
        // =========================

        const combinedRequests = [
          ...myRequestsData,
          ...incomingRequestsData,
        ];

        // Remove duplicates
        // in case the same request appears
        // in both lists

        const uniqueRequests =
          Array.from(
            new Map(
              combinedRequests.map(
                (request) => [
                  request.id,
                  request,
                ]
              )
            ).values()
          );

        setRequests(uniqueRequests);

      } catch (error) {

        console.error(
          "Dashboard Error:",
          error
        );

        toast.error(
          "Unable to load dashboard data."
        );

      } finally {

        setLoading(false);
      }
    };

    fetchDashboardData();

  }, [user.email]);

  // =========================
  // MY DONATIONS
  // =========================

  const myDonations =
    allDonations.filter(
      (donation) =>
        donation.donatedBy === user.email
    );

  // =========================
  // MY REQUESTS
  // =========================

  const myRequests =
    requests.filter(
      (request) =>
        request.requestedBy === user.email
    );

  // =========================
  // INCOMING REQUESTS
  // =========================

  const incomingRequests =
    requests.filter(
      (request) =>
        request.donorEmail === user.email
    );

  // =========================
  // GET DONATION
  // =========================

  const getDonation = (donationId) => {
    return allDonations.find(
      (donation) =>
        String(donation.id) ===
        String(donationId)
    );
  };

  // =========================
  // UPDATE REQUEST STATUS
  // =========================

  const updateRequestStatus = async (
    requestId,
    newStatus
  ) => {

    const currentRequest =
      requests.find(
        (request) =>
          request.id === requestId
      );

    // Safety check

    if (!currentRequest) {
      toast.error(
        "Request not found."
      );

      return;
    }

    // Prevent processing twice

    if (
      currentRequest.status ===
        "Accepted" ||
      currentRequest.status ===
        "Rejected"
    ) {

      toast.info(
        `This request is already ${currentRequest.status.toLowerCase()}.`
      );

      return;
    }

    // =========================
    // START UPDATE
    // =========================

    setUpdatingRequest(requestId);

    try {

      const response =
        await fetch(
          `http://localhost:8080/api/requests/${requestId}/status?status=${encodeURIComponent(
            newStatus
          )}`,
          {
            method: "PUT",
          }
        );

      if (!response.ok) {
        throw new Error(
          "Failed to update request"
        );
      }

      const updatedRequest =
        await response.json();

      // =========================
      // UPDATE STATE
      // =========================

      setRequests(
        (previousRequests) =>
          previousRequests.map(
            (request) =>
              request.id === requestId
                ? updatedRequest
                : request
          )
      );

      // =========================
      // NOTIFICATIONS
      // =========================

      if (
        newStatus === "Accepted"
      ) {

        toast.success(
          "Request accepted successfully! ❤️"
        );
      }

      if (
        newStatus === "Rejected"
      ) {

        toast.info(
          "Request rejected."
        );
      }

    } catch (error) {

      console.error(
        "Update Request Error:",
        error
      );

      toast.error(
        "Unable to update request."
      );

    } finally {

      setUpdatingRequest(null);
    }
  };

  // =========================
  // STATUS ICON
  // =========================

  const getStatusIcon = (
    status
  ) => {

    if (status === "Accepted") {
      return <FaCheck />;
    }

    if (status === "Rejected") {
      return <FaTimes />;
    }

    return <FaClock />;
  };

  // =========================
  // STATUS CLASS
  // =========================

  const getStatusClass = (
    status
  ) => {

    if (status === "Accepted") {
      return "status-accepted";
    }

    if (status === "Rejected") {
      return "status-rejected";
    }

    return "status-pending";
  };

  // =========================
  // FORMAT DATE
  // =========================

  const formatDate = (
    date
  ) => {

    if (!date) {
      return "Recently";
    }

    return new Date(
      date
    ).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {

    return (
      <div className="dashboard-page">

        <div className="dashboard-header">

          <div>

            <h1>
              Welcome,{" "}
              {user.name || "User"} 👋
            </h1>

            <p>
              Loading your dashboard...
            </p>

          </div>

        </div>

      </div>
    );
  }

  // =========================
  // DASHBOARD
  // =========================

  return (
    <div className="dashboard-page">

      {/* =========================
          HEADER
      ========================= */}

      <div className="dashboard-header">

        <div>

          <h1>
            Welcome,{" "}
            {user.name || "User"} 👋
          </h1>

          <p>
            Thank you for helping people through
            donations.
          </p>

        </div>

      </div>

      {/* =========================
          STATS
      ========================= */}

      <div className="stats-grid">

        {/* MY DONATIONS */}

        <div className="stat-card">

          <FaDonate
            className="stat-icon"
          />

          <h2>
            {myDonations.length}
          </h2>

          <p>
            My Donations
          </p>

        </div>

        {/* MY REQUESTS */}

        <div className="stat-card">

          <FaHeart
            className="stat-icon"
          />

          <h2>
            {myRequests.length}
          </h2>

          <p>
            My Requests
          </p>

        </div>

        {/* INCOMING REQUESTS */}

        <div className="stat-card">

          <FaHandHoldingHeart
            className="stat-icon"
          />

          <h2>
            {incomingRequests.length}
          </h2>

          <p>
            Incoming Requests
          </p>

        </div>

      </div>

      {/* =========================
          QUICK ACTIONS
      ========================= */}

      <h2 className="section-title">
        Quick Actions
      </h2>

      <div className="action-grid">

        {/* DONATE */}

        <div
          className="action-card"
          onClick={() =>
            navigate("/donate")
          }
        >

          <FaHandHoldingHeart />

          <h3>
            Donate Item
          </h3>

          <p>
            Donate clothes, books,
            electronics and more.
          </p>

        </div>

        {/* BROWSE */}

        <div
          className="action-card"
          onClick={() =>
            navigate("/browse")
          }
        >

          <FaBoxOpen />

          <h3>
            Browse Items
          </h3>

          <p>
            Explore donations from
            other users.
          </p>

        </div>

        {/* PROFILE */}

        <div
          className="action-card"
          onClick={() =>
            navigate("/profile")
          }
        >

          <FaUser />

          <h3>
            Profile
          </h3>

          <p>
            View and edit your profile.
          </p>

        </div>

      </div>

      {/* =================================================
          INCOMING REQUESTS
      ================================================= */}

      <section className="dashboard-section">

        <div className="section-heading">

          <div>

            <h2>
              Incoming Requests 📥
            </h2>

            <p>
              People who requested your donated items.
            </p>

          </div>

          <span className="request-count">
            {incomingRequests.length}
          </span>

        </div>

        {incomingRequests.length === 0 ? (

          <div className="empty-dashboard">

            <FaHandHoldingHeart />

            <h3>
              No Incoming Requests
            </h3>

            <p>
              When someone requests one of
              your donations, it will appear here.
            </p>

          </div>

        ) : (

          <div className="requests-grid">

            {incomingRequests.map(
              (request) => {

                const donation =
                  getDonation(
                    request.donationId
                  );

                const status =
                  request.status ||
                  "Pending";

                return (

                  <div
                    className="request-card"
                    key={request.id}
                  >

                    {/* ITEM IMAGE */}

                    <div className="request-image">

                      {donation?.image ||
                      request.image ? (

                        <img
                          src={
                            donation?.image ||
                            request.image
                          }
                          alt={
                            request.itemTitle
                          }
                        />

                      ) : (

                        <FaBoxOpen />

                      )}

                    </div>

                    {/* REQUEST INFO */}

                    <div className="request-info">

                      <h3>
                        {request.itemTitle}
                      </h3>

                      <p>

                        <strong>
                          Category:
                        </strong>{" "}

                        {request.category}

                      </p>

                      <p>

                        <strong>
                          Requested by:
                        </strong>{" "}

                        {request.requestedByName ||
                          request.requestedBy}

                      </p>

                      <p>

                        <strong>
                          Email:
                        </strong>{" "}

                        {request.requestedBy}

                      </p>

                      <p>

                        <strong>
                          Location:
                        </strong>{" "}

                        {request.location}

                      </p>

                      <p>

                        <strong>
                          Date:
                        </strong>{" "}

                        {formatDate(
                          request.requestedAt
                        )}

                      </p>

                      {/* STATUS */}

                      <div
                        className={`request-status ${getStatusClass(
                          status
                        )}`}
                      >

                        {getStatusIcon(
                          status
                        )}

                        {status}

                      </div>

                      {/* ACTION BUTTONS */}

                      {status ===
                        "Pending" && (

                        <div className="request-actions">

                          <button
                            className="accept-btn"
                            disabled={
                              updatingRequest ===
                              request.id
                            }
                            onClick={() =>
                              updateRequestStatus(
                                request.id,
                                "Accepted"
                              )
                            }
                          >

                            <FaCheck />

                            {updatingRequest ===
                            request.id
                              ? "Updating..."
                              : "Accept"}

                          </button>

                          <button
                            className="reject-btn"
                            disabled={
                              updatingRequest ===
                              request.id
                            }
                            onClick={() =>
                              updateRequestStatus(
                                request.id,
                                "Rejected"
                              )
                            }
                          >

                            <FaTimes />

                            {updatingRequest ===
                            request.id
                              ? "Updating..."
                              : "Reject"}

                          </button>

                        </div>

                      )}

                    </div>

                  </div>

                );
              }
            )}

          </div>

        )}

      </section>

      {/* =================================================
          MY REQUESTS
      ================================================= */}

      <section className="dashboard-section">

        <div className="section-heading">

          <div>

            <h2>
              My Requests ❤️
            </h2>

            <p>
              Track the items you have requested.
            </p>

          </div>

          <span className="request-count">
            {myRequests.length}
          </span>

        </div>

        {myRequests.length === 0 ? (

          <div className="empty-dashboard">

            <FaBoxOpen />

            <h3>
              No Requests Yet
            </h3>

            <p>
              Browse available donations and
              request an item you need.
            </p>

            <button
              className="browse-dashboard-btn"
              onClick={() =>
                navigate("/browse")
              }
            >
              Browse Donations
            </button>

          </div>

        ) : (

          <div className="requests-grid">

            {myRequests.map(
              (request) => {

                const donation =
                  getDonation(
                    request.donationId
                  );

                const status =
                  request.status ||
                  "Pending";

                return (

                  <div
                    className="request-card"
                    key={request.id}
                  >

                    {/* IMAGE */}

                    <div className="request-image">

                      {donation?.image ||
                      request.image ? (

                        <img
                          src={
                            donation?.image ||
                            request.image
                          }
                          alt={
                            request.itemTitle
                          }
                        />

                      ) : (

                        <FaBoxOpen />

                      )}

                    </div>

                    {/* INFO */}

                    <div className="request-info">

                      <h3>
                        {request.itemTitle}
                      </h3>

                      <p>

                        <strong>
                          Category:
                        </strong>{" "}

                        {request.category}

                      </p>

                      <p>

                        <strong>
                          Location:
                        </strong>{" "}

                        {request.location}

                      </p>

                      <p>

                        <strong>
                          Donor:
                        </strong>{" "}

                        {request.donorEmail}

                      </p>

                      <p>

                        <strong>
                          Requested:
                        </strong>{" "}

                        {formatDate(
                          request.requestedAt
                        )}

                      </p>

                      {/* STATUS */}

                      <div
                        className={`request-status ${getStatusClass(
                          status
                        )}`}
                      >

                        {getStatusIcon(
                          status
                        )}

                        {status}

                      </div>

                      {status ===
                        "Accepted" && (

                        <div className="accepted-message">

                          🎉 Your request has been
                          accepted! Please coordinate
                          with the donor.

                        </div>

                      )}

                      {status ===
                        "Rejected" && (

                        <div className="rejected-message">

                          This request was rejected.
                          You can browse other donations.

                        </div>

                      )}

                    </div>

                  </div>

                );
              }
            )}

          </div>

        )}

      </section>

    </div>
  );
}

export default Dashboard;