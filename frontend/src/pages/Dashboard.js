import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [hazards, setHazards] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isUrgent, setIsUrgent] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [message, setMessage] = useState("");

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
      .then(res => setHazards(res.data.hazards))
      .catch(err => console.log(err));
  }, [userId]);

  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5001/api/hazard/new_hazard", {
        hazard_title: title,
        hazard_description: description,
        is_urgent: isUrgent,
        image_url: imageUrl || null,
        user_id: userId,
      });

      setMessage("Hazard uploaded successfully!");
      setHazards([res.data.hazard, ...hazards]);
      setTitle(""); setDescription(""); setIsUrgent(false); setImageUrl("");
    } catch (err) {
      setMessage(err.response?.data?.error || err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div style={{ maxWidth: 800, margin: "50px auto" }}>
      <h2>Dashboard</h2>
      <button onClick={handleLogout} style={{ marginBottom: 20 }}>Logout</button>

      <section style={{ marginBottom: 40 }}>
        <h3>Upload New Hazard</h3>
        <form onSubmit={handleUpload}>
          <input
            type="text"
            placeholder="Hazard Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ width: "100%", marginBottom: 10 }}
          />
          <textarea
            placeholder="Hazard Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            style={{ width: "100%", marginBottom: 10 }}
          />
          <input
            type="text"
            placeholder="Image URL (optional)"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            style={{ width: "100%", marginBottom: 10 }}
          />
          <label>
            <input
              type="checkbox"
              checked={isUrgent}
              onChange={(e) => setIsUrgent(e.target.checked)}
            /> Mark as Urgent
          </label>
          <br />
          <button type="submit" style={{ width: "100%", marginTop: 10 }}>Upload Hazard</button>
        </form>
        {message && <p>{message}</p>}
      </section>

      <section>
        <h3>Your Hazards</h3>
        {hazards.length === 0 && <p>No hazards reported yet.</p>}
        {hazards.map((hazard) => (
          <div key={hazard.hazard_id} style={{ border: "1px solid #ccc", padding: 10, marginBottom: 10 }}>
            <h4>{hazard.hazard_title}</h4>
            <p>{hazard.hazard_description}</p>
            {hazard.image_url && <img src={hazard.image_url} alt="hazard" style={{ maxWidth: "100%" }} />}
            <p>
              Reported: {new Date(hazard.reported_time).toLocaleString()} | Status: {hazard.is_urgent ? "Urgent" : "Normal"}
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}
