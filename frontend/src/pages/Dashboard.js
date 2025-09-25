import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../dashboard_styles.css";
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
} from "react-icons/fa";
import { BiMenu } from "react-icons/bi";

export default function Dashboard() {
  const [hazards, setHazards] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isUrgent, setIsUrgent] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

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
      const res = await axios.post(
        "http://localhost:5001/api/hazard/new_hazard",
        {
          hazard_title: title,
          hazard_description: description,
          is_urgent: isUrgent,
          image_url: imageUrl || null,
          user_id: userId,
        }
      );

      setMessage("Hazard uploaded successfully!");
      setHazards([res.data.hazard, ...hazards]);
      setTitle("");
      setDescription("");
      setIsUrgent(false);
      setImageUrl("");
      setShowForm(false);
    } catch (err) {
      setMessage(err.response?.data?.error || err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
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
          <a href="#" className="active">
            <span className="nav-icon">
              <FaHome />
            </span>
            <span className="nav-text">Dashboard</span>
          </a>
          <a href="#">
            <span className="nav-icon">
              <FaExclamationTriangle />
            </span>
            <span className="nav-text">My Hazards</span>
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
            <h1>Campus Safety Dashboard</h1>
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
                <h4>{hazard.hazard_title}</h4>
                <p>{hazard.hazard_description}</p>
                {hazard.image_url && (
                  <img src={hazard.image_url} alt="hazard" />
                )}
                <div className="hazard-meta">
                  <span>{new Date(hazard.reported_time).toLocaleString()}</span>
                  <span
                    className={
                      hazard.is_urgent ? "status urgent" : "status normal"
                    }
                  >
                    {hazard.is_urgent ? "Urgent" : "Normal"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

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
                type="text"
                placeholder="Image URL (optional)"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
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
    </div>
  );
}