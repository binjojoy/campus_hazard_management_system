import React from  'react';
import { FaTachometerAlt, FaExclamationTriangle, FaUsers, FaCog, FaSignOutAlt, FaEye } from 'react-icons/fa';
import '../ui/admin_dashboard.css'; // The new CSS file

export default function AdminDashboard() {
  // --- Placeholder Data ---
  // In a real app, you would fetch this data from your API.
  const stats = {
    totalHazards: 125,
    pendingReview: 12,
    inProgress: 8,
    urgent: 5,
  };

  const recentHazards = [
    { id: 1, title: "Exposed Electrical Wire", reportedBy: "testuser", date: "2025-10-02", status: "pending", urgent: true },
    { id: 2, title: "Projector failure", reportedBy: "suresh", date: "2025-10-01", status: "solved", urgent: false },
    { id: 3, title: "Leaking pipe in restroom", reportedBy: "jane_doe", date: "2025-09-30", status: "in-progress", urgent: true },
    { id: 4, title: "Broken window in library", reportedBy: "john_p", date: "2025-09-29", status: "acknowledged", urgent: false },
    { id: 5, title: "Wifi unavailable", reportedBy: "testuser", date: "2025-09-28", status: "rejected", urgent: true },
  ];
  // --- End Placeholder Data ---

  const handleLogout = () => {
    // Your existing logout logic
    console.log("User logged out");
    // navigate('/');
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar - Reusing your existing structure and class names */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <span className="sidebar-icon">🛡️</span>
          <div className="sidebar-header-text">
            <h2>Campus Safety</h2>
            <span className="subtitle">Admin Portal</span>
          </div>
        </div>
        <h4 className="sidebar-heading">Navigation</h4>
        <nav className="sidebar-nav">
          <a href="#" className="active">
            <span className="nav-icon"><FaTachometerAlt /></span>
            <span className="nav-text">Dashboard</span>
          </a>
          <a href="#">
            <span className="nav-icon"><FaExclamationTriangle /></span>
            <span className="nav-text">Manage Hazards</span>
          </a>
          <a href="#">
            <span className="nav-icon"><FaUsers /></span>
            <span className="nav-text">Manage Users</span>
          </a>
        </nav>
        <h4 className="sidebar-heading">Resources</h4>
        <div className="sidebar-resources">
          <a href="#">
            <span className="nav-icon"><FaCog /></span>
            <span className="nav-text">Settings</span>
          </a>
        </div>
        <button className="logout" onClick={handleLogout}>
          <span className="nav-icon"><FaSignOutAlt /></span>
          <span className="nav-text">Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="topbar">
          <div>
            <h1 className="welcome-message">Admin Dashboard</h1>
            <p>Overview of all campus hazard reports</p>
          </div>
        </header>

        {/* Statistics Grid */}
        <section className="stats-grid">
          <div className="stat-card">
            <h3>{stats.totalHazards}</h3>
            <p>Total Hazards</p>
          </div>
          <div className="stat-card">
            <h3>{stats.pendingReview}</h3>
            <p>Pending Review</p>
          </div>
          <div className="stat-card">
            <h3>{stats.inProgress}</h3>
            <p>In Progress</p>
          </div>
          <div className="stat-card urgent-card">
            <h3>{stats.urgent}</h3>
            <p>Urgent Issues</p>
          </div>
        </section>

        {/* Recent Hazards Table */}
        <section className="recent-hazards">
          <h3>Recent Hazard Reports</h3>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Reported By</th>
                <th>Date</th>
                <th>Status</th>
                <th>Urgency</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentHazards.map(hazard => (
                <tr key={hazard.id}>
                  <td>{hazard.title}</td>
                  <td>{hazard.reportedBy}</td>
                  <td>{hazard.date}</td>
                  <td>
                    <span className={`status-badge status-${hazard.status}`}>
                      {hazard.status}
                    </span>
                  </td>
                  <td>
                    {hazard.urgent && (
                      <span className="status-badge status-urgent">Urgent</span>
                    )}
                  </td>
                  <td>
                    <button className="action-btn">
                      <FaEye /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}