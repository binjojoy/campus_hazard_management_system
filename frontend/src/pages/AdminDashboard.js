import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  FaTachometerAlt,
  FaExclamationTriangle,
  FaUsers,
  FaCog,
  FaSignOutAlt,
  FaEye,
  FaRegClock,
  FaUserCircle,
  FaImage,
  FaTimes, // Added for the modal close button
} from 'react-icons/fa';
import '../ui/admin_dashboard.css'; // Your existing admin CSS for stats and table
import '../ui/dashboard_styles.css'; // Reusing the student dashboard CSS for modal and cards

export default function AdminDashboard() {
  const navigate = useNavigate();

  // State management
  const [stats, setStats] = useState(null);
  const [hazards, setHazards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedHazard, setSelectedHazard] = useState(null); // State for the details modal

  // --- Data Fetching and Calculation Effect ---
  useEffect(() => {
    const fetchDataAndCalculateStats = async () => {
      try {
        setLoading(true);
        const hazardsResponse = await axios.get('http://localhost:5001/api/hazard/fetch_all_hazards');
        const allHazards = hazardsResponse.data.hazards;
        
        const calculatedStats = {
          totalHazards: allHazards.length,
          pendingReview: allHazards.filter(h => h.status === 'pending').length,
          inProgress: allHazards.filter(h => h.status === 'in-progress').length,
          urgent: allHazards.filter(h => h.is_urgent === true).length,
        };

        setHazards(allHazards);
        setStats(calculatedStats);

      } catch (err) {
        setError('Failed to load dashboard data. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDataAndCalculateStats();
  }, []);

  // --- Helper Functions ---
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const formatDateTime = (isoDate) => {
    if (!isoDate) return 'N/A';
    const date = new Date(isoDate);
    return date.toLocaleString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true });
  };

  // --- Filtering Logic for Search ---
  const filteredHazards = hazards.filter(hazard =>
    (hazard.hazard_title && hazard.hazard_title.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (hazard.username && hazard.username.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (hazard.status && hazard.status.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="dashboard-layout">
      {/* Sidebar - Consistent with your existing UI */}
      <aside className="sidebar">
        {/* ... Sidebar content remains the same ... */}
        <div className="sidebar-header"><span className="sidebar-icon">🛡️</span><div className="sidebar-header-text"><h2>Campus Safety</h2><span className="subtitle">Admin Portal</span></div></div><h4 className="sidebar-heading">Navigation</h4><nav className="sidebar-nav"><a href="#" className="active"><span className="nav-icon"><FaTachometerAlt /></span><span className="nav-text">Dashboard</span></a><a href="#"><span className="nav-icon"><FaExclamationTriangle /></span><span className="nav-text">Manage Hazards</span></a><a href="#"><span className="nav-icon"><FaUsers /></span><span className="nav-text">Manage Users</span></a></nav><h4 className="sidebar-heading">Resources</h4><div className="sidebar-resources"><a href="#"><span className="nav-icon"><FaCog /></span><span className="nav-text">Settings</span></a></div><button className="logout" onClick={handleLogout}><span className="nav-icon"><FaSignOutAlt /></span><span className="nav-text">Logout</span></button>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="topbar">
          <div>
            <h1 className="welcome-message">Admin Dashboard</h1>
            <p>Overview of all campus hazard reports</p>
          </div>
        </header>

        {loading && <div className="loading-message">Loading dashboard...</div>}
        {error && <div className="error-message">{error}</div>}

        {!loading && !error && (
          <>
            {/* Statistics Grid - Admin Specific */}
            {stats && (
              <section className="stats-grid">
                <div className="stat-card"><h3>{stats.totalHazards}</h3><p>Total Hazards</p></div>
                <div className="stat-card"><h3>{stats.pendingReview}</h3><p>Pending Review</p></div>
                <div className="stat-card"><h3>{stats.inProgress}</h3><p>In Progress</p></div>
                <div className="stat-card urgent-card"><h3>{stats.urgent}</h3><p>Urgent Issues</p></div>
              </section>
            )}

            {/* Search Bar */}
            <div className="search-bar">
              <input type="text" placeholder="Search hazards by title, user, or status..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>

            {/* All Hazards Table */}
            <section className="recent-hazards">
              <h3>All Hazard Reports ({filteredHazards.length})</h3>
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
                  {filteredHazards.map((hazard) => (
                    <tr key={hazard.hazard_id}>
                      <td>{hazard.hazard_title}</td>
                      <td>{hazard.username}</td>
                      <td>{new Date(hazard.reported_time).toLocaleDateString()}</td>
                      <td><span className={`status-badge status-${hazard.status || 'default'}`}>{hazard.status || 'N/A'}</span></td>
                      <td>{hazard.is_urgent && (<span className="status-badge status-urgent">Urgent</span>)}</td>
                      <td><button className="action-btn" onClick={() => setSelectedHazard(hazard)}><FaEye /> Details</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          </>
        )}
      </main>

      {/* Details Modal */}
      {selectedHazard && (
        <div className="modal-overlay" onClick={() => setSelectedHazard(null)}>
          <div className="hazard-card modal-card" onClick={e => e.stopPropagation()}>
            <div className="hazard-card-header">
              {selectedHazard.is_urgent && <span className="status-badge status-urgent"><FaExclamationTriangle /> Urgent</span>}
              <button className="close-card-btn" onClick={() => setSelectedHazard(null)}><FaTimes /></button>
            </div>
            <div className="hazard-content">
              <h4>{selectedHazard.hazard_title}</h4>
              <p className="hazard-description-text">{selectedHazard.hazard_description}</p>
              {selectedHazard.image_url ? (
                <div className="hazard-image-container"><img src={selectedHazard.image_url} alt="hazard" className="hazard-image" /></div>
              ) : (
                <div className="hazard-image-placeholder"><FaImage className="placeholder-icon" /><span>No Image</span></div>
              )}
              <div className="hazard-meta">
                <span className="hazard-timestamp"><FaUserCircle /> Reported by: <strong>{selectedHazard.username || 'Anonymous'}</strong></span>
                <span className="hazard-timestamp"><FaRegClock /> {formatDateTime(selectedHazard.reported_time)}</span>
              </div>
            </div>
            <div className="hazard-card-footer">
              <span className={`status-badge status-${selectedHazard.status || 'default'}`}>{selectedHazard.status || 'N/A'}</span>
              {/* Future actions can go here, e.g., a dropdown to change status */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

