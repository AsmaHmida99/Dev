import { Link } from 'react-router-dom';
import { CheckCircle2, Target, BarChart3, ArrowRight } from 'lucide-react';
import Header from '../../components/header/header';
import dashboardImg from '../../assets/homeImage.png';
import './home.css';

export default function HomePage() {
  return (
    <div className="home-container">
      <div className="home-background"></div>
      <div className="home-background-effects">
        <div className="home-blur-circle home-blur-top"></div>
        <div className="home-blur-circle home-blur-bottom"></div>
      </div>

      <Header showSignUp={true} />

      <section className="home-hero">
        <div className="home-hero-content">
          <div className="home-hero-text">
            <h1 className="home-title">
              Transform your{' '}
              <span className="home-title-gradient">project management</span>
            </h1>

            <p className="home-description">
              Organize, track and complete your projects efficiently. A complete platform to manage your tasks and
              track progress.
            </p>

            <div className="home-stats">
              <div className="home-stat">
                <div className="home-stat-header">
                  <Target className="icon-sm stat-icon" />
                  <span className="home-stat-value">98%</span>
                </div>
                <span className="home-stat-label">Projects delivered</span>
              </div>
              <div className="home-stat">
                <div className="home-stat-header">
                  <CheckCircle2 className="icon-sm stat-icon" />
                  <span className="home-stat-value">2.5k+</span>
                </div>
                <span className="home-stat-label">Tasks managed</span>
              </div>
            </div>

            <div className="home-cta">
              <Link to="/signin" className="cta-button">
                Get Started
                <ArrowRight className="icon-sm" />
              </Link>
            </div>
          </div>

          <div className="home-hero-image">
            <div className="home-image-wrapper">
              <img src={dashboardImg} alt="3D Project Management" className="home-dashboard-img" />
            </div>

            <div className="home-card home-card-left">
              <div className="home-card-content">
                <div className="home-card-icon card-icon-purple">
                  <CheckCircle2 className="icon" />
                </div>
                <div>
                  <p className="home-card-title">24 tasks completed</p>
                </div>
              </div>
            </div>

            <div className="home-card home-card-right">
              <div className="home-card-content">
                <div className="home-card-icon card-icon-blue">
                  <BarChart3 className="icon" />
                </div>
                <div>
                  <p className="home-card-title">85% progress</p>
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}