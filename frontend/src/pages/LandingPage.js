import React from 'react';
import '../ui/landing_page.css';

const ShieldIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

const LandingPage = () => {
  return (
    <div className="landing-page">
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="brand">
            <div className="brand-icon">
              <ShieldIcon />
            </div>
            <div className="brand-info">
              <h1>Campus Safety</h1>
              <span>Hazard Management</span>
            </div>
          </div>
          <a href="/login" className="login-button">Login</a>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="container">
            <div className="hero-wrapper">
              <h1 className="hero-title">Manage Campus Hazards Effectively</h1>
              <p className="hero-description">
                Report, track and resolve safety issues across your campus. 
                Keep your community safe with real-time hazard management.
              </p>
              <a href="/login" className="hero-button">Get Started</a>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <div className="container">
            <div className="features-wrapper">
              <div className="feature-item">
                <h3>Quick Reporting</h3>
                <p>Submit hazard reports instantly with location details and photos.</p>
              </div>
              <div className="feature-item">
                <h3>Real-time Tracking</h3>
                <p>Monitor the status of reported issues from submission to resolution.</p>
              </div>
              <div className="feature-item">
                <h3>Team Management</h3>
                <p>Assign tasks to maintenance teams and track progress efficiently.</p>
              </div>
              <div className="feature-item">
                <h3>Analytics & Reports</h3>
                <p>Generate detailed reports and track safety trends across campus.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer-section">
        <div className="container">
          <div className="footer-wrapper">
            <div className="footer-brand">
              <div className="brand-icon">
                <ShieldIcon />
              </div>
              <span>Campus Safety</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
