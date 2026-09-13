import { useState } from "react";
import {
  FaUsers,
  FaHandHoldingHeart,
  FaBuilding,
  FaClock,
  FaCheck,
  FaTimes,
  FaChartLine,
  FaBoxOpen,
  FaTags,
  FaFileAlt,
  FaExclamationTriangle,
  FaTrash,
} from "react-icons/fa";

import "./AdminDashboard.css";

function AdminDashboard() {

  // ==========================================
  // NGO / BENEFICIARY DATA
  // ==========================================

  const [organizations, setOrganizations] = useState([
    {
      id: 1,
      name: "Helping Hands Foundation",
      email: "helpinghands@example.com",
      city: "Kolhapur",
      type: "NGO",
      status: "Pending",
    },
    {
      id: 2,
      name: "Hope Children's Home",
      email: "hopehome@example.com",
      city: "Pune",
      type: "Orphanage",
      status: "Pending",
    },
    {
      id: 3,
      name: "Care & Share Trust",
      email: "caretrust@example.com",
      city: "Mumbai",
      type: "NGO",
      status: "Verified",
    },
  ]);

  const updateVerification = (id, status) => {

    setOrganizations((previous) =>
      previous.map((organization) =>
        organization.id === id
          ? {
              ...organization,
              status,
            }
          : organization
      )
    );
  };

  // ==========================================
  // DONATION DATA
  // ==========================================

  const [donations] = useState([
    {
      id: 1,
      item: "Clothes",
      donor: "Nilesh Shinde",
      category: "Clothes",
      status: "Distributed",
      location: "Kolhapur",
    },
    {
      id: 2,
      item: "Laptop",
      donor: "Rahul Patil",
      category: "Electronics",
      status: "Scheduled",
      location: "Pune",
    },
    {
      id: 3,
      item: "Books",
      donor: "Sneha More",
      category: "Books",
      status: "Accepted",
      location: "Mumbai",
    },
    {
      id: 4,
      item: "Table",
      donor: "Amit Jadhav",
      category: "Furniture",
      status: "Requested",
      location: "Kolhapur",
    },
  ]);

  // ==========================================
  // CATEGORIES
  // ==========================================

  const [categories, setCategories] = useState([
    "Clothes",
    "Electronics",
    "Furniture",
    "Books",
    "Toys",
    "Others",
  ]);

  const [newCategory, setNewCategory] = useState("");

  const addCategory = () => {

    const category = newCategory.trim();

    if (!category) {
      return;
    }

    if (
      categories.some(
        (item) =>
          item.toLowerCase() === category.toLowerCase()
      )
    ) {
      alert("Category already exists.");
      return;
    }

    setCategories([
      ...categories,
      category,
    ]);

    setNewCategory("");
  };

  const deleteCategory = (category) => {

    setCategories(
      categories.filter(
        (item) => item !== category
      )
    );
  };

  // ==========================================
  // COMPLAINTS
  // ==========================================

  const [complaints, setComplaints] = useState([
    {
      id: 1,
      user: "Rahul Patil",
      issue: "Pickup was delayed",
      status: "Pending",
    },
    {
      id: 2,
      user: "Sneha More",
      issue: "Wrong item received",
      status: "Pending",
    },
    {
      id: 3,
      user: "Amit Jadhav",
      issue: "Donation request issue",
      status: "Resolved",
    },
  ]);

  const resolveComplaint = (id) => {

    setComplaints((previous) =>
      previous.map((complaint) =>
        complaint.id === id
          ? {
              ...complaint,
              status: "Resolved",
            }
          : complaint
      )
    );
  };

  // ==========================================
  // STATISTICS
  // ==========================================

  const totalUsers = 128;

  const totalDonations =
    donations.length;

  const verifiedOrganizations =
    organizations.filter(
      (organization) =>
        organization.status === "Verified"
    ).length;

  const pendingOrganizations =
    organizations.filter(
      (organization) =>
        organization.status === "Pending"
    ).length;

  const collectedDonations =
    donations.filter(
      (donation) =>
        donation.status === "Distributed" ||
        donation.status === "Collected"
    ).length;

  const distributedDonations =
    donations.filter(
      (donation) =>
        donation.status === "Distributed"
    ).length;

  const pendingComplaints =
    complaints.filter(
      (complaint) =>
        complaint.status === "Pending"
    ).length;

  return (

    <div className="admin-page">

      {/* =====================================
          HEADER
      ====================================== */}

      <div className="admin-header">

        <div>

          <h1>
            Admin Dashboard 📊
          </h1>

          <p>
            Monitor donations, users and
            organization verification.
          </p>

        </div>

        <div className="admin-badge">
          Administrator
        </div>

      </div>


      {/* =====================================
          STAT CARDS
      ====================================== */}

      <div className="admin-stats">

        <div className="admin-stat-card">

          <div className="stat-icon">
            <FaUsers />
          </div>

          <div>

            <h3>
              {totalUsers}
            </h3>

            <p>
              Registered Users
            </p>

          </div>

        </div>


        <div className="admin-stat-card">

          <div className="stat-icon">
            <FaHandHoldingHeart />
          </div>

          <div>

            <h3>
              {totalDonations}
            </h3>

            <p>
              Total Donations
            </p>

          </div>

        </div>


        <div className="admin-stat-card">

          <div className="stat-icon">
            <FaBuilding />
          </div>

          <div>

            <h3>
              {verifiedOrganizations}
            </h3>

            <p>
              Verified Organizations
            </p>

          </div>

        </div>


        <div className="admin-stat-card">

          <div className="stat-icon">
            <FaClock />
          </div>

          <div>

            <h3>
              {pendingOrganizations}
            </h3>

            <p>
              Pending Verification
            </p>

          </div>

        </div>

      </div>


      {/* =====================================
          PLATFORM OVERVIEW
      ====================================== */}

      <div className="admin-overview">

        <div className="overview-card">

          <div className="overview-title">

            <FaChartLine />

            <h2>
              Platform Overview
            </h2>

          </div>


          <div className="overview-items">

            <div>
              <span>
                Donations Collected
              </span>

              <strong>
                {collectedDonations}
              </strong>
            </div>


            <div>
              <span>
                Donations Distributed
              </span>

              <strong>
                {distributedDonations}
              </strong>
            </div>


            <div>
              <span>
                Active Donors
              </span>

              <strong>
                87
              </strong>
            </div>


            <div>
              <span>
                Repeat Donors
              </span>

              <strong>
                31
              </strong>
            </div>

          </div>

        </div>

      </div>


      {/* =====================================
          NGO VERIFICATION
      ====================================== */}

      <div className="verification-section">

        <div className="section-heading">

          <div>

            <h2>
              NGO / Beneficiary Verification
            </h2>

            <p>
              Verify organizations before they
              receive donations.
            </p>

          </div>

        </div>


        <div className="verification-table">

          <div className="table-header">

            <span>
              Organization
            </span>

            <span>
              Type
            </span>

            <span>
              City
            </span>

            <span>
              Status
            </span>

            <span>
              Action
            </span>

          </div>


          {organizations.map(
            (organization) => (

              <div
                className="table-row"
                key={organization.id}
              >

                <div className="organization-info">

                  <strong>
                    {organization.name}
                  </strong>

                  <small>
                    {organization.email}
                  </small>

                </div>


                <span>
                  {organization.type}
                </span>


                <span>
                  {organization.city}
                </span>


                <span
                  className={
                    organization.status ===
                    "Verified"
                      ? "verified-status"
                      : organization.status ===
                        "Rejected"
                      ? "rejected-status"
                      : "pending-status"
                  }
                >
                  {organization.status}
                </span>


                <div className="verification-actions">

                  {organization.status ===
                  "Pending" ? (

                    <>

                      <button
                        className="verify-btn"
                        onClick={() =>
                          updateVerification(
                            organization.id,
                            "Verified"
                          )
                        }
                      >
                        <FaCheck />
                        Verify
                      </button>


                      <button
                        className="reject-btn"
                        onClick={() =>
                          updateVerification(
                            organization.id,
                            "Rejected"
                          )
                        }
                      >
                        <FaTimes />
                        Reject
                      </button>

                    </>

                  ) : organization.status ===
                    "Verified" ? (

                    <span className="already-verified">
                      ✓ Verified
                    </span>

                  ) : (

                    <span className="rejected-status">
                      Rejected
                    </span>

                  )}

                </div>

              </div>

            )
          )}

        </div>

      </div>


      {/* =====================================
          DONATION MONITORING
      ====================================== */}

      <div className="admin-section">

        <div className="section-title">

          <FaBoxOpen />

          <div>

            <h2>
              Donation Monitoring
            </h2>

            <p>
              Monitor donations and their
              current status.
            </p>

          </div>

        </div>


        <div className="donation-table">

          <div className="donation-table-header">

            <span>
              Item
            </span>

            <span>
              Donor
            </span>

            <span>
              Category
            </span>

            <span>
              Location
            </span>

            <span>
              Status
            </span>

          </div>


          {donations.map(
            (donation) => (

              <div
                className="donation-table-row"
                key={donation.id}
              >

                <strong>
                  {donation.item}
                </strong>

                <span>
                  {donation.donor}
                </span>

                <span>
                  {donation.category}
                </span>

                <span>
                  {donation.location}
                </span>

                <span
                  className={`admin-status ${donation.status.toLowerCase()}`}
                >
                  {donation.status}
                </span>

              </div>

            )
          )}

        </div>

      </div>


      {/* =====================================
          CATEGORY MANAGEMENT
      ====================================== */}

      <div className="admin-section">

        <div className="section-title">

          <FaTags />

          <div>

            <h2>
              Category Management
            </h2>

            <p>
              Manage donation item categories.
            </p>

          </div>

        </div>


        <div className="category-manager">

          <div className="category-add">

            <input
              type="text"
              placeholder="Enter new category"
              value={newCategory}
              onChange={(event) =>
                setNewCategory(
                  event.target.value
                )
              }
            />

            <button
              onClick={addCategory}
            >
              Add Category
            </button>

          </div>


          <div className="category-list">

            {categories.map(
              (category) => (

                <div
                  className="admin-category"
                  key={category}
                >

                  <span>
                    {category}
                  </span>

                  <button
                    onClick={() =>
                      deleteCategory(
                        category
                      )
                    }
                  >
                    <FaTrash />
                  </button>

                </div>

              )
            )}

          </div>

        </div>

      </div>


      {/* =====================================
          REPORTS
      ====================================== */}

      <div className="admin-section">

        <div className="section-title">

          <FaFileAlt />

          <div>

            <h2>
              Donation Reports
            </h2>

            <p>
              Summary of platform donation activity.
            </p>

          </div>

        </div>


        <div className="report-grid">

          <div className="report-card">

            <span>
              Total Donations
            </span>

            <strong>
              64
            </strong>

          </div>


          <div className="report-card">

            <span>
              Requested
            </span>

            <strong>
              12
            </strong>

          </div>


          <div className="report-card">

            <span>
              Accepted
            </span>

            <strong>
              9
            </strong>

          </div>


          <div className="report-card">

            <span>
              Scheduled
            </span>

            <strong>
              7
            </strong>

          </div>


          <div className="report-card">

            <span>
              Collected
            </span>

            <strong>
              58
            </strong>

          </div>


          <div className="report-card">

            <span>
              Distributed
            </span>

            <strong>
              42
            </strong>

          </div>

        </div>

      </div>


      {/* =====================================
          COMPLAINTS
      ====================================== */}

      <div className="admin-section">

        <div className="section-title">

          <FaExclamationTriangle />

          <div>

            <h2>
              Complaints & Disputes
            </h2>

            <p>
              Handle user complaints and
              donation disputes.
            </p>

          </div>

        </div>


        <div className="complaints-list">

          {complaints.map(
            (complaint) => (

              <div
                className="complaint-card"
                key={complaint.id}
              >

                <div>

                  <strong>
                    {complaint.issue}
                  </strong>

                  <small>
                    Reported by:{" "}
                    {complaint.user}
                  </small>

                </div>


                <span
                  className={
                    complaint.status ===
                    "Resolved"
                      ? "resolved-status"
                      : "complaint-pending"
                  }
                >
                  {complaint.status}
                </span>


                {complaint.status ===
                  "Pending" && (

                  <button
                    className="resolve-btn"
                    onClick={() =>
                      resolveComplaint(
                        complaint.id
                      )
                    }
                  >
                    <FaCheck />
                    Resolve
                  </button>

                )}

              </div>

            )
          )}

        </div>


        <div className="complaint-summary">

          <FaExclamationTriangle />

          <span>
            {pendingComplaints} complaint(s)
            currently require attention.
          </span>

        </div>

      </div>

    </div>
  );
}

export default AdminDashboard;