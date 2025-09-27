import React from 'react';
import { Link } from 'react-router-dom';
import '../ui/landing_page.css';
// Lucide React icons as inline SVGs
const ShieldIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 13c0 5-3.5 7.5-8 12.5-4.5-5-8-7.5-8-12.5V6c0-2.76 2.24-5 5-5h2c1.66 0 3 1.34 3 3 0 1.66 1.34 3 3 3s3-1.34 3-3c0-1.66 1.34-3 3-3h0c2.76 0 5 2.24 5 5v7z"/>
  </svg>
);

const AlertTriangleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
    <path d="M12 9v4"/>
    <circle cx="12" cy="17" r="1"/>
  </svg>
);

const UsersIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="m22 21-2-2"/>
    <path d="m16 16-2-2"/>
  </svg>
);

const ClockIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12,6 12,12 16,14"/>
  </svg>
);

const MapPinIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

const BellIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
  </svg>
);

const LandingPage = () => {
  const features = [
    {
      icon: AlertTriangleIcon,
      title: "Instant Hazard Reporting",
      description: "Report campus safety issues with precise location details in seconds through our intuitive interface."
    },
    {
      icon: UsersIcon,
      title: "Role-Based Access",
      description: "Separate dashboards for students, staff, and administrators ensuring appropriate access and workflow."
    },
    {
      icon: ClockIcon,
      title: "Real-Time Tracking",
      description: "Monitor hazard status from report to resolution with live updates and transparent progress tracking."
    },
    {
      icon: ShieldIcon,
      title: "Enhanced Campus Safety",
      description: "Proactive hazard management creates a safer environment for the entire campus community."
    },
    {
      icon: MapPinIcon,
      title: "Precise Location Mapping",
      description: "Accurate location data ensures maintenance teams can quickly locate and address reported issues."
    },
    {
      icon: BellIcon,
      title: "Smart Notifications",
      description: "Stay informed with timely updates on report status, resolutions, and important safety alerts."
    }
  ];


  const steps = [
    {
      step: "1",
      title: "Report Issue",
      description: "Students and staff can quickly report hazards with detailed descriptions and precise location data through our user-friendly interface."
    },
    {
      step: "2", 
      title: "Track Progress",
      description: "Real-time status updates keep everyone informed about the progress of reported issues from submission to resolution."
    },
    {
      step: "3",
      title: "Resolution & Feedback", 
      description: "Maintenance teams resolve issues efficiently, and users can provide feedback to ensure quality and continuous improvement."
    }
  ];

  return (
    <div className="landing-page">
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="header-content">
            <div className="brand">
              <div className="brand-icon">
                <ShieldIcon />
              </div>
              <div className="brand-text">
                <h1>Campus Safety</h1>
                <p>Hazard Management</p>
              </div>
            </div>
            <Link to="/login" className="btn btn-primary">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-grid">
            <div className="hero-content">
              <div className="hero-text">
                <div className="badge">
                  Real-Time Campus Safety Platform
                </div>
                <h1 className="hero-title">
                  Safer Campus Through{" "}
                  <span className="gradient-text">Smart Reporting</span>
                </h1>
                <p className="hero-description">
                  A digital platform that empowers students, staff, and administrators to report, track, and resolve campus hazards in real-time, creating a transparent and accountable safety ecosystem.
                </p>
              </div>
              
              <div className="hero-cta">
                <Link to="/login" className="btn btn-primary btn-large">
                  Start Reporting Issues
                </Link>
              </div>
            </div>
            
            <div className="hero-image">
              <div className="image-container">
                <img 
                  src="/assets/campus-hero.jpg" 
                  alt="Safe and modern university campus" 
                />
                <div className="image-overlay"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2>Why Choose Our Platform?</h2>
            <p>Built for transparency, accountability, and safer campus experiences through innovative technology.</p>
          </div>
          
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-header">
                  <div className="feature-icon">
                    <feature.icon />
                  </div>
                  <h3>{feature.title}</h3>
                </div>
                <div className="feature-content">
                  <p>{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="container">
          <div className="section-header">
            <h2>How It Works</h2>
            <p>Simple, efficient, and effective hazard management</p>
          </div>
          
          <div className="steps-grid">
            {steps.map((item, index) => (
              <div key={index} className="step-item">
                <div className="step-number">
                  <span>{item.step}</span>
                </div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-card">
            <div className="cta-content">
              <h2>Ready to Make Your Campus Safer?</h2>
              <p>
                Join our community of proactive campus safety advocates. Start reporting issues and contributing to a safer educational environment today.
              </p>
              <div className="cta-button">
                <Link to="/login" className="btn btn-secondary btn-large">
                  Get Started Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="brand">
                <div className="brand-icon small">
                  <ShieldIcon />
                </div>
                <span>Campus Safety</span>
              </div>
              <p>
                Building safer campus communities through innovative hazard reporting and management technology.
              </p>
            </div>
            
            <div className="footer-column">
              <h4>Platform</h4>
              <ul>
                <li><a href="#">Dashboard</a></li>
                <li><a href="#">Report Issues</a></li>
                <li><a href="#">Track Status</a></li>
                <li><a href="#">Analytics</a></li>
              </ul>
            </div>
            
            <div className="footer-column">
              <h4>Support</h4>
              <ul>
                <li><a href="#">Help Center</a></li>
                <li><a href="#">Guidelines</a></li>
                <li><a href="#">Contact Us</a></li>
                <li><a href="#">Training</a></li>
              </ul>
            </div>
            
            <div className="footer-column">
              <h4>Resources</h4>
              <ul>
                <li><a href="#">Safety Tips</a></li>
                <li><a href="#">Best Practices</a></li>
                <li><a href="#">Campus Map</a></li>
                <li><a href="#">Emergency Info</a></li>
              </ul>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>&copy; 2025 Campus Safety Management System. Built for safer educational environments.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;