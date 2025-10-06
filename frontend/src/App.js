import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AllHazards from './pages/AllHazards';
import LandingPage from './pages/LandingPage';
import AdminDashboard from './pages/AdminDashboard';
import ManageHazards from './pages/ManageHazards';
import MessageReports from './pages/MessageReports';  
import Feedback from './pages/Feedback';
function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/allhazards" element={<AllHazards/>} />
      <Route path="/admindashboard" element={<AdminDashboard/>} />
      <Route path='/manage-hazards' element={<ManageHazards/>} />
      <Route path="/message_reports"element={<MessageReports />} /> {/* Corrected: Added dynamic parameter */}
      <Route path="/feedback" element={<Feedback />} />
    </Routes>
  );
}

export default App;
