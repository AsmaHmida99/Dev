import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Header from '../../components/header/header';
import './signIn.css';

export default function SignInPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Sign in data:', formData);
    navigate('/project');
  };

  return (
    <div className="signin-container">
      <div className="signin-background"></div>
      <div className="signin-background-effects">
        <div className="signin-blur-circle signin-blur-top"></div>
        <div className="signin-blur-circle signin-blur-bottom"></div>
      </div>

      <Header />

      <div className="signin-content">
        <div className="signin-form-wrapper">
          <div className="signin-card">
            <div className="signin-card-content">
              <div className="signin-header">
                <h1 className="signin-title">Sign In</h1>
                <p className="signin-subtitle">Enter your information to sign in</p>
              </div>

              <form onSubmit={handleSubmit} className="signin-form">
                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <div className="input-wrapper">
                    <input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="form-input"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <div className="form-label-row">
                    <label htmlFor="password" className="form-label">
                      Password
                    </label>
                    <Link to="/forgot-password" className="forgot-link">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="input-wrapper">
                    <input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="form-input"
                      required
                    />
                  </div>
                </div>

                <button type="submit" className="submit-button">
                  Sign In
                  <ArrowRight className="button-icon" />
                </button>
              </form>

              <div className="signin-footer">
                <span className="footer-text">Don't have an account? </span>
                <Link to="/signup" className="footer-link">
                  Create an account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}