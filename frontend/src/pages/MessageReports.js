import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../ui/dashboard_styles.css";
import "../ui/message_reports_style.css";
import sidebarIcon from '../assets/sidebar.png';
import {
  FaHome,
  FaExclamationTriangle,
  FaFileAlt,
  FaMapMarkedAlt,
  FaScroll,
  FaPhoneAlt,
  FaBell,
  FaCog,
  FaSignOutAlt,
  FaEnvelopeOpen,
  FaEnvelope,
  FaTimes,
  FaRegClock,
} from "react-icons/fa";
import { BiMenu } from "react-icons/bi";

export default function MessageReports() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [expandedCard, setExpandedCard] = useState(null);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  useEffect(() => {
    if (!user) navigate("/");
  }, [user, navigate]);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    axios
      .get(`http://localhost:5001/api/hazard/fetch_messages?user_id=${userId}`)
      .then((res) => {
        setMessages(res.data.messages);
        setLoading(false);
      })
      .catch((err) => {
        setMessage("Failed to fetch messages.");
        console.log(err);
        setLoading(false);
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

  const handleMessageClick = (msg) => {
      setExpandedCard(msg);
  }

  return (
    <div
      className={`dashboard-layout message-reports-page ${
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
          <a href="#" onClick={() => navigate('/allhazards')}>
            <span className="nav-icon">
              <FaExclamationTriangle />
            </span>
            <span className="nav-text">All Hazards</span>
          </a>
          <a href="#" className="active" onClick={() => navigate('/message_reports')}>
            <span className="nav-icon">
              <FaFileAlt />
            </span>
            <span className="nav-text">Reports</span>
          </a>
          <a href="#"  onClick={() => navigate('/feedback')}>
            <span className="nav-icon">
              <FaMapMarkedAlt />
            </span>
            <span className="nav-text">Feedback</span>
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
              My Reports
            </h1>
            <p>View messages from the administration</p>
          </div>
          <div className="notifications">
            <button>
              <FaBell /> Notifications ({messages.filter(m => !m.is_read).length})
            </button>
          </div>
        </header>

        <section className="reports">
          <h3>Your Messages ({messages.length})</h3>
          {message && <p>{message}</p>}
          {loading ? (
            <p>Loading messages...</p>
          ) : (
            messages.length === 0 ? (
              <p>No messages to display.</p>
            ) : (
              <div className="reports-list-view">
                {messages.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={`reports-list-item ${!msg.is_read ? 'unread' : ''}`}
                    onClick={() => handleMessageClick(msg)}
                  >
                    <div className="report-icon">
                      {!msg.is_read ? <FaEnvelopeOpen /> : <FaEnvelope />}
                    </div>
                    <div className="report-content">
                      <h4 className="report-title">{msg.hazard.hazard_title || "No Hazard Title"}</h4>
                      <p className="report-description">{msg.content}</p>
                    </div>
                    <div className="report-meta">
                      <span className="report-timestamp">
                        <FaRegClock />
                        {formatDateTime(msg.created_at)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </section>
      </main>
      
      {expandedCard && (
        <div className="expanded-card-modal">
          <div className="expanded-card-container">
            <button className="modal-close-btn" onClick={() => setExpandedCard(null)}>
              <FaTimes />
            </button>
            <div className="expanded-card-content">
              <h4>{expandedCard.hazard ? expandedCard.hazard.hazard_title : "No Hazard Title"}</h4>
              <p className="message-content">{expandedCard.content}</p>
              <div className="expanded-card-meta">
                <span className="expanded-card-timestamp">
                  <FaRegClock />
                  {formatDateTime(expandedCard.created_at)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}