# Donation & Reuse Platform

A web-based Donation & Reuse Platform that connects people who want to donate unused items with people and organizations who need them.

The platform provides a simple and organized way to donate items, browse available donations, request items, manage donations, and track requests.

## Live Project

🌐 **Live Website:** https://donation-reuse-platform-ten.vercel.app

💻 **GitHub Repository:** https://github.com/NileshShinde2005/Donation-Reuse-Platform

## Features

- User Registration and Login
- Google Login
- User Dashboard
- Donate Items
- Browse Available Donations
- Donation Details
- Request Donations
- Accept or Reject Requests
- My Donations
- Edit and Delete Donations
- Donation Status Tracking
- Pickup Scheduling
- Notifications
- User Profile Management
- NGO Listing and Details
- Admin Dashboard
- User Verification
- Donation Monitoring and Reports
- Responsive User Interface

## Technology Stack

### Frontend
- React.js
- Vite
- React Router
- AOS
- React Toastify
- React Icons
- Google Identity Services

### Backend
- Java
- Spring Boot
- Spring Data JPA
- REST APIs
- Maven

### Database
- MySQL
- Aiven MySQL

### Deployment
- Vercel - Frontend
- Render - Backend
- Aiven - Database

## Project Structure

```text
Donation-Reuse-Platform/
│
├── client/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
│
├── server/
│   ├── src/
│   ├── pom.xml
│   └── Dockerfile
│
└── README.md

How It Works
A user creates an account or logs in using Google.
Donors can add items they want to donate.
Other users can browse available donations.
A user can request an available item.
The donor can accept or reject the request.
Accepted requests are reserved and can be scheduled for pickup.
Users can track their donations and requests through their dashboard.
Administrators can monitor users, donations, and verification activities.
Main Modules
User Module

Handles registration, login, Google authentication, profile management and verification.

Donation Module

Allows donors to create, edit, delete and manage donated items.

Request Module

Allows users to request items and allows donors to accept or reject requests.

NGO Module

Provides information about NGOs and organizations involved in donation activities.

Admin Module

Allows administrators to monitor users, donations, requests and verification activities.

Deployment Architecture
                User
                  │
                  ▼
        ┌──────────────────┐
        │     Vercel       │
        │ React Frontend   │
        └────────┬─────────┘
                 │
                 │ REST API
                 ▼
        ┌──────────────────┐
        │     Render       │
        │ Spring Boot API  │
        └────────┬─────────┘
                 │
                 │ MySQL
                 ▼
        ┌──────────────────┐
        │      Aiven       │
        │   MySQL Database │
        └──────────────────┘
Local Setup
Frontend
cd client
npm install
npm run dev

The frontend will normally run on:

http://localhost:5173
Backend

Open the server project using an IDE such as IntelliJ IDEA or Eclipse and run the Spring Boot application.

The backend normally runs on:

http://localhost:8080
Database

Configure the MySQL connection details in the backend configuration.

Do not commit database passwords or other secrets to GitHub.

Project Status

✅ Frontend completed
✅ Backend completed
✅ Database connected
✅ Authentication implemented
✅ Donation and request workflow implemented
✅ Admin features implemented
✅ Frontend deployed
✅ Backend deployed
✅ Cloud database configured
✅ Live project working

Future Scope
Online donation payment support
Real-time notifications
Improved pickup and delivery tracking
Mobile application
AI-based donation recommendations
Location-based donation matching
Advanced analytics and reporting
Conclusion

The Donation & Reuse Platform provides a centralized solution for donating and reusing unused items. It helps connect donors, beneficiaries and NGOs while making the donation process easier to manage and track.


### Step 2 — Save it

Make sure the file is here:

```text
D:\Donation-Reuse-Platform\README.md

Then in your terminal:

git add README.md
git commit -m "Add project README"
git push
