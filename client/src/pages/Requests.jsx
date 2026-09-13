import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  FaInbox,
  FaPaperPlane,
  FaCheck,
  FaTimes,
  FaCalendarAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";
import "./Requests.css";

function Requests() {
  const user =
    JSON.parse(localStorage.getItem("user")) || {};

  const [myRequests, setMyRequests] = useState([]);
  const [incomingRequests, setIncomingRequests] =
    useState([]);

  const [loading, setLoading] = useState(true);

  // =========================
  // FETCH REQUESTS
  // =========================

  const fetchRequests = useCallback(async () => {
    if (!user.email) {
      setLoading(false);
      return;
    }

    try {
      const [myResponse, incomingResponse] =
        await Promise.all([
          fetch(
            `https://donation-reuse-platform.onrender.com/api/requests/user/${encodeURIComponent(
              user.email
            )}`
          ),

          fetch(
            `https://donation-reuse-platform.onrender.com/api/requests/donor/${encodeURIComponent(
              user.email
            )}`
          ),
        ]);

      if (!myResponse.ok || !incomingResponse.ok) {
        throw new Error("Failed to fetch requests");
      }

      const myData = await myResponse.json();
      const incomingData =
        await incomingResponse.json();

      setMyRequests(myData);
      setIncomingRequests(incomingData);

    } catch (error) {
      console.error(
        "Request Fetch Error:",
        error
      );

      toast.error(
        "Failed to load requests."
      );
    } finally {
        setLoading(false);
    }
   }, [user.email]);

  useEffect(() => {
  const loadRequests = async () => {
    await fetchRequests();
  };

  loadRequests();
  }, [user.email]);

  // =========================
  // UPDATE STATUS
  // =========================

  const updateStatus = async (
    requestId,
    status
  ) => {
    try {
      const response = await fetch(
        `https://donation-reuse-platform.onrender.com/api/requests/${requestId}/status?status=${status}`,
        {
          method: "PUT",
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to update request"
        );
      }

      toast.success(
        `Request ${status.toLowerCase()} successfully!`
      );

      fetchRequests();

    } catch (error) {
      console.error(
        "Status Update Error:",
        error
      );

      toast.error(
        "Failed to update request."
      );
    }
  };

  // =========================
  // STATUS CLASS
  // =========================

  const getStatusClass = (status) => {
    switch (status?.toUpperCase()) {
      case "ACCEPTED":
        return "status-accepted";

      case "REJECTED":
        return "status-rejected";

      case "COMPLETED":
        return "status-completed";

      default:
        return "status-pending";
    }
  };

  // =========================
  // REQUEST CARD
  // =========================

  const RequestCard = ({
    request,
    incoming = false,
  }) => (
    <div className="request-card">

      <div className="request-image">

        {request.image ? (
          <img
            src={request.image}
            alt={request.itemTitle}
          />
        ) : (
          <div className="no-request-image">
            🎁
          </div>
        )}

      </div>

      <div className="request-content">

        <h3>
          {request.itemTitle}
        </h3>

        <p>
          <strong>Category:</strong>{" "}
          {request.category}
        </p>

        <p>
          <FaMapMarkerAlt />
          {request.location}
        </p>

        {incoming ? (
          <p>
            <strong>Requested By:</strong>{" "}
            {request.requestedByName ||
              request.requestedBy}
          </p>
        ) : (
          <p>
            <strong>Donor:</strong>{" "}
            {request.donorEmail}
          </p>
        )}

        {request.requestedAt && (
          <p>
            <FaCalendarAlt />
            {new Date(
              request.requestedAt
            ).toLocaleDateString()}
          </p>
        )}

        <span
          className={`request-status ${getStatusClass(
            request.status
          )}`}
        >
          {request.status || "PENDING"}
        </span>

        {incoming &&
          (!request.status ||
            request.status.toUpperCase() ===
              "PENDING") && (

            <div className="request-actions">

              <button
                className="accept-btn"
                onClick={() =>
                  updateStatus(
                    request.id,
                    "ACCEPTED"
                  )
                }
              >
                <FaCheck />
                Accept
              </button>

              <button
                className="reject-btn"
                onClick={() =>
                  updateStatus(
                    request.id,
                    "REJECTED"
                  )
                }
              >
                <FaTimes />
                Reject
              </button>

            </div>
          )}

      </div>

    </div>
  );

  // =========================
  // UI
  // =========================

  return (
    <div className="requests-page">

      <div className="requests-header">

        <h1>
          Donation Requests 🤝
        </h1>

        <p>
          Manage your donation requests and
          incoming requests.
        </p>

      </div>

      {loading ? (

        <div className="requests-empty">
          Loading requests...
        </div>

      ) : (

        <>
          {/* =========================
              MY REQUESTS
          ========================= */}

          <section className="requests-section">

            <div className="section-title">

              <FaPaperPlane />

              <h2>
                My Requests
              </h2>

            </div>

            {myRequests.length === 0 ? (

              <div className="requests-empty">
                <FaPaperPlane />

                <p>
                  You haven't requested any
                  donations yet.
                </p>
              </div>

            ) : (

              <div className="requests-grid">

                {myRequests.map((request) => (

                  <RequestCard
                    key={request.id}
                    request={request}
                  />

                ))}

              </div>

            )}

          </section>

          {/* =========================
              INCOMING REQUESTS
          ========================= */}

          <section className="requests-section">

            <div className="section-title">

              <FaInbox />

              <h2>
                Incoming Requests
              </h2>

            </div>

            {incomingRequests.length === 0 ? (

              <div className="requests-empty">
                <FaInbox />

                <p>
                  No incoming requests yet.
                </p>
              </div>

            ) : (

              <div className="requests-grid">

                {incomingRequests.map(
                  (request) => (

                    <RequestCard
                      key={request.id}
                      request={request}
                      incoming={true}
                    />

                  )
                )}

              </div>

            )}

          </section>
        </>
      )}

    </div>
  );
}

export default Requests;