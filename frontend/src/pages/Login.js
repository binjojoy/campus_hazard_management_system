import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../login_styles.css"; // reuse your friend’s CSS for the flip effect

export default function Login() {
  const [isFlipped, setIsFlipped] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("student");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleFlip = () => {
    setMessage(""); // clear error/success when flipping
    setIsFlipped((prev) => !prev);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5001/api/auth/login", {
        email,
        password,
      });
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard");
    } catch (err) {
      setMessage(err.response?.data?.message || err.message);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5001/api/auth/signup", {
        email,
        password,
        username,
        role,
      });
      setMessage(`Signup success! User ${res.data.user.email} created.`);
      setTimeout(() => {
        setIsFlipped(false); // flip back to login after signup
      }, 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="app">
      <div className={`flip-container ${isFlipped ? "flipped" : ""}`}>
        <div className="flipper">
          {/* LOGIN SIDE */}
          <div className="front ls-form">
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="submit">Login</button>
            </form>
            {message && !isFlipped && <p>{message}</p>}
            <p>
              Don’t have an account?{" "}
              <span className="link" onClick={handleFlip}>
                Sign up
              </span>
            </p>
          </div>

          {/* SIGNUP SIDE */}
          <div className="back ls-form">
            <h2>Sign Up</h2>
            <form onSubmit={handleSignup}>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              >
                <option value="student">Student</option>
                <option value="maintenance">Maintenance</option>
              </select>
              <button type="submit">Sign Up</button>
            </form>
            {message && isFlipped && <p>{message}</p>}
            <p>
              Already have an account?{" "}
              <span className="link" onClick={handleFlip}>
                Login
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
