import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../ui/dashboard_styles.css";
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

export default function Dashboard() {
  const [hazards, setHazards] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isUrgent, setIsUrgent] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false); // Corrected: State for modal visibility
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [expandedImage, setExpandedImage] = useState(null);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  useEffect(() => {
    if (!user) navigate("/");
  }, [user, navigate]);

  useEffect(() => {
    if (!userId) return;
    axios
      .get(`http://localhost:5001/api/hazard/fetch_hazard?user_id=${userId}`)
      .then((res) => setHazards(res.data.hazards))
      .catch((err) => console.log(err));
  }, [userId]);

  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("hazard_title", title);
      formData.append("hazard_description", description);
      formData.append("is_urgent", isUrgent);
      formData.append("user_id", userId);
      formData.append("status", 'pending');
      
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const res = await axios.post(
        "http://localhost:5001/api/hazard/new_hazard",
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      setMessage("Hazard uploaded successfully!");
      setHazards([res.data.hazard, ...hazards]);
      setTitle("");
      setDescription("");
      setIsUrgent(false);
      setImageFile(null);
      setShowForm(false);
    } catch (err) {
      setMessage(err.response?.data?.error || err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };
  
  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const getStatusIcon = (status) => {
    if (status === 'solved' || status === 'acknowledged') {
      return <FaCheckCircle />;
    }
    if (status === 'rejected') {
      return <FaTimes />;
    }
    return null;
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

  return (
    <div
      className={`dashboard-layout ${
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
          <a href="#" className="active" onClick={() => navigate('/dashboard')}>
            <span className="nav-icon">
              <FaHome />
            </span>
            <span className="nav-text">Dashboard</span>
          </a>
          <a href="#" onClick={() => navigate('/allhazards')}>
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
          <a href="#">
            <span className="nav-icon">
              <FaMapMarkedAlt />
            </span>
            <span className="nav-text">Campus Map</span>
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
          <a href="#">
            <span className="nav-icon">
              <FaCog />
            </span>
            <span className="nav-text">Settings</span>
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
              {user?.profile?.username ? `Welcome, ${user.profile.username}!` : "Welcome!"}
            </h1>
            <p>Manage and track campus hazards</p>
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
          <h3>Your Hazard Reports ({hazards.length})</h3>
          {hazards.length === 0 && <p>No hazards reported yet.</p>}
          <div className="hazard-grid">
            {hazards.map((hazard) => (
              <div key={hazard.hazard_id} className="hazard-card">
                <div className="hazard-card-header">
                  {hazard.is_urgent && (
                    <span className="status-badge status-urgent">
                      <FaExclamationTriangle />
                      {' Urgent'}
                    </span>
                  )}
                  <button className="close-card-btn"><FaTimes /></button>
                </div>
                <div className="hazard-content">
                  <h4>{hazard.hazard_title}</h4>
                  <p className="hazard-description-text">{hazard.hazard_description}</p>
                  {hazard.image_url ? (
                    <div className="hazard-image-container">
                      <img src={hazard.image_url} alt="hazard" className="hazard-image" />
                      <button 
                        className="expand-image-btn"
                        onClick={() => setExpandedImage(hazard.image_url)}
                      >
                        <FaExpand />
                      </button>
                    </div>
                  ) : (
                    <div className="hazard-image-placeholder">
                      <FaImage className="placeholder-icon" />
                      <span>No Image Available</span>
                    </div>
                  )}
                  <div className="hazard-meta">
                    {hazard.location && <span className="hazard-location">{hazard.location}</span>}
                    <span className="hazard-timestamp">
                      <FaRegClock />
                      {formatDateTime(hazard.reported_time)}
                    </span>
                  </div>
                </div>
                <div className="hazard-card-footer">
                  {hazard.status && (
                    <span className={`status-badge status-${hazard.status}`}>
                      {getStatusIcon(hazard.status)}
                      {` ${hazard.status.charAt(0).toUpperCase() + hazard.status.slice(1)}`}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Corrected: The Create Hazard Form Modal */}
      <button className="fab" onClick={() => setShowForm(true)}>
        <FaPlus />
      </button>

      {showForm && (
        <div className="modal-overlay">
          <div className="upload-section modal">
            <h3>Report New Hazard</h3>
            <form onSubmit={handleUpload}>
              <input
                type="text"
                placeholder="Hazard Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <textarea
                placeholder="Hazard Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleFileChange}
              />
              <label className="urgent">
                <input
                  type="checkbox"
                  checked={isUrgent}
                  onChange={(e) => setIsUrgent(e.target.checked)}
                />
                Mark as Urgent
              </label>
              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="upload-btn">
                  Submit Report
                </button>
              </div>
            </form>
            {message && <p className="message">{message}</p>}
          </div>
        </div>
      )}
      
      {/* New: Expanded Image Modal */}
      {expandedImage && (
        <div className="expanded-image-modal" onClick={() => setExpandedImage(null)}>
          <button className="modal-close-btn" onClick={() => setExpandedImage(null)}>
            <FaTimes />
          </button>
          <img src={expandedImage} alt="Expanded Hazard" />
        </div>
      )}
    </div>
  );
}