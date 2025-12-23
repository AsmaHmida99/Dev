import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Header from '../../components/header/header';
import { useAuth } from '../../context/AuthContext';
import './signUp.css';

export default function SignUpPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      await register(formData.email, formData.password);
      navigate('/signin', { state: { message: 'Account created successfully! Please sign in.' } });
    } catch (err) {
      // Extraire le message d'erreur
      let errorMessage = 'Failed to create account. Please try again.';

      if (err && typeof err === 'object') {
        if (err.message) {
          errorMessage = err.message;
        } else if (err.response?.data?.message) {
          errorMessage = err.response.data.message;
        } else if (typeof err === 'string') {
          errorMessage = err;
        }
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-background"></div>

      <div className="signup-background-effects">
        <div className="signup-blur-circle signup-blur-top"></div>
        <div className="signup-blur-circle signup-blur-bottom"></div>
      </div>

      <Header />

     
      <div className="signup-content">
        <div className="signup-form-wrapper">
          <div className="signup-card">
            <div className="signup-card-content">

              <div className="signup-header">
                <h1 className="signup-title">Create an account</h1>
                <p className="signup-subtitle">
                  Enter your information to create your account
                </p>
              </div>

              <form onSubmit={handleSubmit} className="signup-form">
                {error && (
                  <div style={{
                    padding: '12px',
                    backgroundColor: '#fee2e2',
                    color: '#991b1b',
                    borderRadius: '8px',
                    fontSize: '14px',
                    marginBottom: '16px'
                  }}>
                    {error}
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="name" className="form-label">Full name</label>
                  <div className="input-wrapper">
                    <input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="form-input"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="email" className="form-label">Email</label>
                  <div className="input-wrapper">
                    <input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="form-input"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="password" className="form-label">Password</label>
                  <div className="input-wrapper">
                    <input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className="form-input"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword" className="form-label">
                    Confirm password
                  </label>
                  <div className="input-wrapper">
                    <input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          confirmPassword: e.target.value,
                        })
                      }
                      className="form-input"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <button type="submit" className="submit-button" disabled={loading}>
                  {loading ? 'Creating account...' : 'Create my account'}
                  {!loading && <ArrowRight className="button-icon" />}
                </button>
              </form>

              <div className="signup-footer">
                <span className="footer-text">Already have an account? </span>
                <Link to="/signin" className="footer-link">
                  Sign in
                </Link>
              </div>
            </div>
          </div>

          <p className="signup-terms">
            By creating an account, you agree to our{' '}
            <Link to="/terms" className="terms-link">Terms of Service</Link>{' '}
            and our{' '}
            <Link to="/privacy" className="terms-link">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
