import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  FaTachometerAlt, FaExclamationTriangle, FaUsers, FaCog, FaSignOutAlt,
  FaEye, FaRegClock, FaUserCircle, FaImage, FaTimes, 
  FaHistory, FaEdit, FaTools, FaPaperPlane,
} from 'react-icons/fa';

// Import the required CSS files
import '../ui/admin_dashboard.css';
import '../ui/dashboard_styles.css';

export default function ManageHazards() {
  const navigate = useNavigate();

  // --- Get Logged-in User ---
  const user = JSON.parse(localStorage.getItem("user"));

  // --- State Management ---
  const [hazards, setHazards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [managingHazard, setManagingHazard] = useState(null);

  // Modal-specific state
  const [actions, setActions] = useState([]);
  const [newStatus, setNewStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  // --- New State for Messaging ---
  const [messages, setMessages] = useState([]);
  const [newMessageContent, setNewMessageContent] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [messagesLoading, setMessagesLoading] = useState(false);

  // --- Data Fetching ---
  const fetchHazards = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5001/api/hazard/fetch_all_hazards');
      setHazards(res.data.hazards.sort((a, b) => new Date(b.reported_time) - new Date(a.reported_time)));
    } catch (err) {
      setError('Failed to load hazards. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHazards();
  }, []);

  // --- Fetch Messages When Modal Opens ---
  useEffect(() => {
    if (managingHazard) {
      const fetchMessages = async () => {
        setMessagesLoading(true);
        try {
          const res = await axios.get(`http://localhost:5001/api/hazards/${managingHazard.hazard_id}/messages`);
          setMessages(res.data);
        } catch (err) {
          console.error("Failed to fetch messages", err);
        } finally {
          setMessagesLoading(false);
        }
      };
      fetchMessages();
    }
  }, [managingHazard]);

  // --- Modal Logic ---
  const openManageModal = async (hazard) => {
    setManagingHazard(hazard);
    setNewStatus(hazard.status);
    setModalLoading(true);
    try {
      const actionsRes = await axios.get(`http://localhost:5001/api/hazards/${hazard.hazard_id}/actions`);
      setActions(actionsRes.data);
    } catch (err) {
      setActions([]);
    } finally {
      setModalLoading(false);
    }
  };

  const closeManageModal = () => {
    setManagingHazard(null);
    setActions([]);
    setNewStatus("");
    setMessages([]);
    setNewMessageContent("");
  };

  // --- Form Handlers ---
  const handleUpdateStatus = async () => {
    if (newStatus === managingHazard.status) return;
    setIsSubmitting(true);
    try {
      await axios.put(`http://localhost:5001/api/hazard/update_status/${managingHazard.hazard_id}`, {
        status: newStatus
      });

      const logDescription = `Status changed to ${newStatus}`;
      const adminUserId = user?.id || "bdd12a57-de63-4875-8539-3b5f0434836d"; // Use real ID or fallback
      
      await axios.post(`http://localhost:5001/api/hazards/${managingHazard.hazard_id}/actions`, {
        description: logDescription,
        staff_id: adminUserId 
      });

      await fetchHazards();
      closeManageModal();
    } catch (err) {
      console.error("An error occurred during the update process:", err);
      alert("An error occurred. The status or the action log might not have been saved correctly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Function to Send a New Message ---
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessageContent.trim()) return;
    
    setIsSending(true);
    try {
      const res = await axios.post(`http://localhost:5001/api/hazards/${managingHazard.hazard_id}/messages`, {
        content: newMessageContent,
        sender_id: user?.id,
      });
      setMessages([...messages, res.data]);
      setNewMessageContent("");
    } catch (err) {
      console.error("Failed to send message", err);
      alert("Error: Could not send the message.");
    } finally {
      setIsSending(false);
    }
  };

  // --- Helper Functions ---
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };
  
  const formatDateTime = (isoDate) => {
    if (!isoDate) return 'N/A';
    return new Date(isoDate).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
  };
  
  const filteredHazards = hazards.filter(h =>
    (h.hazard_title && h.hazard_title.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (h.username && h.username.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (h.status && h.status.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-header"><span className="sidebar-icon">🛡️</span><div className="sidebar-header-text"><h2>Campus Safety</h2><span className="subtitle">Admin Portal</span></div></div>
        <h4 className="sidebar-heading">Navigation</h4>
        <nav className="sidebar-nav">
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/admindashboard'); }}>
            <span className="nav-icon"><FaTachometerAlt /></span><span className="nav-text">Dashboard</span>
          </a>
          <a href="#" className="active" onClick={(e) => { e.preventDefault(); navigate('/manage-hazards'); }}>
            <span className="nav-icon"><FaExclamationTriangle /></span><span className="nav-text">Manage Hazards</span>
          </a>
          <a href="#"><span className="nav-icon"><FaUsers /></span><span className="nav-text">Manage Users</span></a>
        </nav>
        <h4 className="sidebar-heading">Resources</h4>
        <div className="sidebar-resources"><a href="#"><span className="nav-icon"><FaCog /></span><span className="nav-text">Settings</span></a></div>
        <button className="logout" onClick={handleLogout}><span className="nav-icon"><FaSignOutAlt /></span><span className="nav-text">Logout</span></button>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <h1 className="welcome-message">Manage Hazards</h1>
            <p>Update status, log actions, and resolve reported issues</p>
          </div>
        </header>

        {loading && <div className="loading-message">Loading hazards...</div>}
        {error && <div className="error-message">{error}</div>}

        {!loading && !error && (
          <>
            <div className="search-bar">
              <input type="text" placeholder="Search hazards..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <section className="recent-hazards">
              <h3>All Hazard Reports ({filteredHazards.length})</h3>
              <div className="table-container">
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
                      <td><span className={`status-badge status-${hazard.status}`}>{hazard.status}</span></td>
                      <td>{hazard.is_urgent && (<span className="status-badge status-urgent">Urgent</span>)}</td>
                      <td><button className="action-btn manage-btn" onClick={() => openManageModal(hazard)}><FaEdit /> Manage</button></td>
                    </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </main>

      {managingHazard && (
        <div className="modal-overlay" onClick={closeManageModal}>
          <div className="modal-card-new" onClick={e => e.stopPropagation()}>
            <button className="close-card-btn-new" onClick={closeManageModal}><FaTimes /></button>
            
            {managingHazard.image_url ? (
              <div className="modal-image-container">
                <img src={managingHazard.image_url} alt="Hazard" />
              </div>
            ) : (
              <div className="modal-image-placeholder">
                <FaImage />
                <span>No Image Provided</span>
              </div>
            )}

            <div className="modal-content-area">
              <div className="modal-header">
                <span className={`status-badge status-${managingHazard.status}`}>{managingHazard.status}</span>
                <h3>{managingHazard.hazard_title}</h3>
                <p className="modal-description">{managingHazard.hazard_description}</p>
              </div>

              <div className="modal-meta">
                <div className="meta-item">
                  <FaUserCircle />
                  <span>Reported by <strong>{managingHazard.username || 'N/A'}</strong></span>
                </div>
                <div className="meta-item">
                  <FaRegClock />
                  <span>{formatDateTime(managingHazard.reported_time)}</span>
                </div>
              </div>
              
              <div className="admin-section">
                <div className="admin-section-header">
                  <FaTools />
                  <h4>Admin Controls</h4>
                </div>

                <div className="control-group">
                  <label htmlFor="status-select">Update Status</label>
                  <div className="status-update-form-new">
                    <select id="status-select" value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                      <option value="pending">Pending</option>
                      <option value="acknowledged">Acknowledged</option>
                      <option value="rejected">Rejected</option>
                      <option value="solved">Solved</option>
                    </select>
                    <button onClick={handleUpdateStatus} disabled={isSubmitting || newStatus === managingHazard.status}>
                      {isSubmitting ? 'Saving...' : 'Save Status'}
                    </button>
                  </div>
                </div>
                
                <div className="control-group">
                  <label><FaHistory /> Action History</label>
                  <div className="action-log-new">
                    {modalLoading ? <p>Loading...</p> : 
                      actions.length > 0 ? (
                        actions.map(action => (
                          <div key={action.id} className="action-item-new">
                            <p className="action-desc">{action.description}</p>
                            <span className="action-meta">{formatDateTime(action.created_at)}</span>
                          </div>
                        ))
                      ) : <p className="no-actions">No actions logged yet.</p>
                    }
                  </div>
                </div>

                {/* --- THIS IS THE MESSAGE SECTION --- */}
                <div className="control-group">
                  <label><FaPaperPlane /> Send a Message to Student</label>
                  
                  <div className="message-history">
                    {messagesLoading ? <p>Loading messages...</p> :
                      messages.length > 0 ? (
                        messages.map(msg => (
                          <div key={msg.id} className="message-bubble">
                            <strong className="message-sender">{msg.sender?.username || 'Admin'}</strong>
                            <p className="message-content">{msg.content}</p>
                            <span className="message-timestamp">{formatDateTime(msg.created_at)}</span>
                          </div>
                        ))
                      ) : <p className="no-actions">No messages have been sent yet.</p>
                    }
                  </div>

                  <form className="message-input-form" onSubmit={handleSendMessage}>
                    <textarea
                      placeholder="Type your message..."
                      value={newMessageContent}
                      onChange={(e) => setNewMessageContent(e.target.value)}
                      disabled={isSending}
                    />
                    <button type="submit" disabled={isSending}>
                      {isSending ? '...' : 'Send'}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}