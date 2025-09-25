import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../ui/dashboard_styles.css";
import "../ui/all_hazards_style.css";
import sidebarIcon from '../assets/sidebar.png';
import {
  FaHome,
  FaExclamationTriangle,
  FaFileAlt,
  FaMapMarkedAlt,
  FaScroll,
  FaPhoneAlt,
  FaCog,
  FaSignOutAlt,
  FaPlus,
  FaBell,
  FaImage,
  FaCheckCircle,
  FaTimes,
  FaRegClock,
  FaExpand,
} from "react-icons/fa";
import { BiMenu } from "react-icons/bi";

export default function AllHazards() {
  const [hazards, setHazards] = useState([]);
  const [message, setMessage] = useState("");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [expandedCard, setExpandedCard] = useState(null);
  const [sortBy, setSortBy] = useState('all');

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  useEffect(() => {
    if (!user) navigate("/");
  }, [user, navigate]);

  useEffect(() => {
    if (!userId) return;
    axios
      .get(`http://localhost:5001/api/hazard/fetch_all_hazards`)
      .then((res) => setHazards(res.data.hazards))
      .catch((err) => {
        setMessage("Failed to fetch all hazards.");
        console.log(err);
      });
  }, [userId]);
  
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };
  
  const formatDateTime = (isoDate) => {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12;

    return `${day}/${month}/${year}, ${hours}:${minutes} ${ampm}`;
  };

  const filteredHazards = hazards.filter(hazard => {
    if (sortBy === 'all') return true;
    if (sortBy === 'urgent') return hazard.is_urgent;
    return hazard.status === sortBy;
  });

  const statuses = ['all', 'urgent', 'pending', 'acknowledged', 'solved', 'rejected'];

  const getStatusIcon = (status) => {
    if (status === 'solved' || status === 'acknowledged') {
      return <FaCheckCircle />;
    }
    if (status === 'rejected') {
      return <FaTimes />;
    }
    return null;
  };
  
  return (
    <div
      className={`dashboard-layout all-hazards-page ${
        isSidebarCollapsed ? "sidebar-collapsed" : ""
      }`}
    >
      <aside className="sidebar">
        <div className="sidebar-header">
          <span className="sidebar-icon">🛡️</span>
          <div className="sidebar-header-text">
            <h2>Campus Safety</h2>
            <span className="subtitle">Hazard Management</span>
          </div>
          <button
            className="sidebar-toggle-btn"
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          >
            {isSidebarCollapsed ? (
              <BiMenu />
            ) : (
              <img
                src={sidebarIcon}
                alt="Toggle Sidebar"
                className="sidebar-icon-img"
              />
            )}
          </button>
        </div>

        <h4 className="sidebar-heading">Navigation</h4>
        <nav className="sidebar-nav">
          <a href="#" onClick={() => navigate('/dashboard')}>
            <span className="nav-icon">
              <FaHome />
            </span>
            <span className="nav-text">Dashboard</span>
          </a>
          <a href="#" className="active" onClick={() => navigate('/allhazards')}>
            <span className="nav-icon">
              <FaExclamationTriangle />
            </span>
            <span className="nav-text">All Hazards</span>
          </a>
          <a href="#">
            <span className="nav-icon">
              <FaFileAlt />
            </span>
            <span className="nav-text">Reports</span>
          </a>
        </nav>

        <h4 className="sidebar-heading">Resources</h4>
        <div className="sidebar-resources">
          <a href="#">
            <span className="nav-icon">
              <FaScroll />
            </span>
            <span className="nav-text">Safety Guidelines</span>
          </a>
          <a href="#">
            <span className="nav-icon">
              <FaPhoneAlt />
            </span>
            <span className="nav-text">Emergency Contacts</span>
          </a>
        </div>
        <button className="logout" onClick={handleLogout}>
          <span className="nav-icon">
            <FaSignOutAlt />
          </span>
          <span className="nav-text">Logout</span>
        </button>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <h1 className="welcome-message">
              All Campus Hazards
            </h1>
            <p>View all reported hazards</p>
          </div>
          <div className="notifications">
            <button>
              <FaBell /> Notifications ({hazards.length})
            </button>
          </div>
        </header>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Search hazards by title, description, or location..."
          />
        </div>

        <section className="hazards">
          <h3>All Reported Hazards ({filteredHazards.length})</h3>
          {message && <p>{message}</p>}
          <div className="sort-options">
            {statuses.map(status => (
              <button
                key={status}
                className={`sort-btn ${sortBy === status ? 'active' : ''}`}
                onClick={() => setSortBy(status)}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
          {filteredHazards.length === 0 && <p>No hazards match the selected filter.</p>}
          <div className="hazard-list-view">
            {filteredHazards.map((hazard) => (
              <button key={hazard.hazard_id} className="hazard-list-item" onClick={() => setExpandedCard(hazard)}>
                <div className="list-item-content">
                  <div className="list-item-main-info">
                    <div className="list-item-title-container">
                      <h4 className="list-item-title">{hazard.hazard_title}</h4>
                      {hazard.is_urgent && (
                        <span className="status-badge status-urgent">
                          <FaExclamationTriangle />
                          {' Urgent'}
                        </span>
                      )}
                    </div>
                    <p className="list-item-description">{hazard.hazard_description}</p>
                  </div>
                  <div className="list-item-meta">
                    <span className="list-item-username">
                      @{hazard.username || "Anonymous"}
                    </span>
                    <span className="list-item-timestamp">
                      <FaRegClock />
                      {formatDateTime(hazard.reported_time)}
                    </span>
                    {hazard.status && (
                      <span className={`status-badge status-${hazard.status}`}>
                        {getStatusIcon(hazard.status)}
                        {` ${hazard.status.charAt(0).toUpperCase() + hazard.status.slice(1)}`}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>
      </main>
      
      {expandedCard && (
        <div className="expanded-card-modal">
          <div className="expanded-card-container">
            <button className="modal-close-btn" onClick={() => setExpandedCard(null)}>
              <FaTimes />
            </button>
            <div className="expanded-card-image-container">
              {expandedCard.image_url ? (
                <img src={expandedCard.image_url} alt="Expanded Hazard" className="expanded-card-image" />
              ) : (
                <div className="hazard-image-placeholder">
                  <FaImage className="placeholder-icon" />
                  <span>No Image Available</span>
                </div>
              )}
            </div>
            <div className="expanded-card-content">
              <h4>{expandedCard.hazard_title}</h4>
              <p>{expandedCard.hazard_description}</p>
              <div className="expanded-card-meta">
                <span className="expanded-card-username">
                  @{expandedCard.username || "Anonymous"}
                </span>
                <span className="expanded-card-timestamp">
                  <FaRegClock />
                  {formatDateTime(expandedCard.reported_time)}
                </span>
              </div>
              <div className="expanded-card-footer">
                {expandedCard.status && (
                  <span className={`status-badge status-${expandedCard.status}`}>
                    {getStatusIcon(expandedCard.status)}
                    {` ${expandedCard.status.charAt(0).toUpperCase() + expandedCard.status.slice(1)}`}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}