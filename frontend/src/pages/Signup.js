import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("student");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5001/api/auth/signup", {
        email, password, username, role
      });

      setMessage(`Signup success! User ${res.data.user.email} created.`);
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || err.message);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "50px auto" }}>
      <h2>Signup</h2>
      <form onSubmit={handleSignup}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: "100%", marginBottom: 10 }}
        />
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={{ width: "100%", marginBottom: 10 }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: "100%", marginBottom: 10 }}
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={{ width: "100%", marginBottom: 10 }}
        >
          <option value="student">Student</option>
          <option value="maintenance">Maintenance</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit" style={{ width: "100%" }}>Signup</button>
      </form>
      {message && <p>{message}</p>}
      <p>Already have an account? <a href="/">Login</a></p>
    </div>
  );
}
