import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "../ui/dashboard_styles.css";
import "../ui/feedback_style.css";
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
  FaStar,
  FaRegClock,
  FaTimes,
  FaCheckCircle,
} from "react-icons/fa";
import { BiMenu } from "react-icons/bi";

export default function Feedback() {
  const navigate = useNavigate();
  const { hazardId } = useParams();
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  useEffect(() => {
    if (!user) navigate("/");
  }, [user, navigate]);

  useEffect(() => {
    if (!hazardId) {
      setMessage("Hazard ID is missing.");
      setLoading(false);
      return;
    }

    setLoading(true);
    axios
      //.get(`http://localhost:5001/api/hazards/${hazardId}/feedback`)
      .get(`http://localhost:5001/api/feedback`)
      .then((res) => {
        setFeedback(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setMessage("Failed to fetch feedback.");
        console.log(err);
        setLoading(false);
      });
  }, [hazardId]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };
  
  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };
  
  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    if (!rating) {
      setNotification({ message: 'Please provide a rating.', type: 'error' });
      return;
    }
    
    try {
      const payload = {
        rating,
        comment,
        user_id: userId,
      };

      await axios.post(
        //`http://localhost:5001/api/hazards/${hazardId}/feedback`,
        `http://localhost:5001/api/feedback`,
        payload
      );
      
      setRating(0);
      setComment("");
      setNotification({ message: 'Feedback submitted successfully!', type: 'success' });
      
      //const res = await axios.get(`http://localhost:5001/api/hazards/${hazardId}/feedback`);
      const res = await axios.get(`http://localhost:5001/api/feedback`);
      setFeedback(res.data);

    } catch (err) {
      setNotification({ message: err.response?.data?.error || 'Failed to submit feedback.', type: 'error' });
    }
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
      className={`dashboard-layout feedback-page ${
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
          <a href="#" onClick={() => navigate(`/message_reports`)}>
            <span className="nav-icon">
              <FaFileAlt />
            </span>
            <span className="nav-text">Reports</span>
          </a>
          <a href="#" className='active' onClick={() => navigate(`/feedback`)}>
            <span className="nav-icon">
              <FaMapMarkedAlt />
            </span>
            <span className="nav-text" >Feedback</span>
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
              Feedback for Hazard {hazardId}
            </h1>
            <p>View feedback and leave your own</p>
          </div>
          <div className="notifications">
            <button>
              <FaBell /> Notifications
            </button>
          </div>
        </header>

        <section className="feedback-section">
          <h3>Leave Your Feedback</h3>
          <form onSubmit={handleSubmitFeedback} className="feedback-form">
            <div className="rating-container">
              {[...Array(5)].map((star, i) => {
                const ratingValue = i + 1;
                return (
                  <label key={i}>
                    <input
                      type="radio"
                      name="rating"
                      value={ratingValue}
                      onClick={() => handleRatingChange(ratingValue)}
                      style={{ display: 'none' }}
                    />
                    <FaStar
                      className="star"
                      color={ratingValue <= rating ? "#ffc107" : "#e4e5e9"}
                      size={30}
                    />
                  </label>
                );
              })}
            </div>
            <textarea
              placeholder="Add your comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows="4"
              className="feedback-textarea"
            />
            <button type="submit" className="submit-feedback-btn">
              Submit Feedback
            </button>
          </form>
        </section>
        
        <section className="existing-feedback-section">
          <h3>Existing Feedback ({feedback.length})</h3>
          {loading ? (
            <p>Loading feedback...</p>
          ) : (
            feedback.length === 0 ? (
              <p>No feedback to display.</p>
            ) : (
              <div className="feedback-list">
                {feedback.map((f) => (
                  <div key={f.id} className="feedback-card">
                    <div className="feedback-card-header">
                      <div className="feedback-rating">
                        {[...Array(5)].map((star, i) => (
                          <FaStar key={i} color={i < f.rating ? "#ffc107" : "#e4e5e9"} />
                        ))}
                      </div>
                      <span className="feedback-timestamp">
                        <FaRegClock />
                        {formatDateTime(f.created_at)}
                      </span>
                    </div>
                    <p className="feedback-comment">{f.comment}</p>
                  </div>
                ))}
              </div>
            )
          )}
        </section>
      </main>
      
      {notification && (
        <div className={`notification-card ${notification.type}`}>
          <div className="notification-content">
            <FaCheckCircle />
            <span>{notification.message}</span>
          </div>
          <button className="notification-close-btn" onClick={() => setNotification(null)}>
            <FaTimes />
          </button>
        </div>
      )}
    </div>
  );
}