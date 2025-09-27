import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AllHazards from './pages/AllHazards';
import LandingPage from './pages/LandingPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/allhazards" element={<AllHazards/>} />
    </Routes>
  );
}

export default App;
