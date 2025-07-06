import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import './AuthPages.css';

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleReady, setGoogleReady] = useState(false);
  
  // Use refs to prevent duplicate initialization
  const googleInitialized = useRef(false);
  const googleScriptLoaded = useRef(false);
  const cleanupRef = useRef(null);

  // Load Google Sign-In script
  useEffect(() => {
    // Prevent duplicate initialization
    if (googleInitialized.current) return;

    const loadGoogleScript = () => {
      // Check if Google is already loaded
      if (window.google && window.google.accounts) {
        initializeGoogleSignIn();
        return;
      }

      // Check if script is already being loaded
      if (googleScriptLoaded.current) return;
      
      // Check if script already exists
      const existingScript = document.querySelector('script[src*="accounts.google.com/gsi/client"]');
      if (existingScript) {
        googleScriptLoaded.current = true;
        if (window.google && window.google.accounts) {
          initializeGoogleSignIn();
        } else {
          existingScript.onload = initializeGoogleSignIn;
        }
        return;
      }

      googleScriptLoaded.current = true;
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogleSignIn;
      script.onerror = () => {
        console.error('Failed to load Google Sign-In script');
        googleScriptLoaded.current = false;
        setError('Failed to load Google Sign-In. Please refresh the page.');
      };
      document.head.appendChild(script);
    };

    const initializeGoogleSignIn = () => {
      // Prevent duplicate initialization
      if (googleInitialized.current) return;
      
      const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;      
      if (window.google && window.google.accounts && GOOGLE_CLIENT_ID) {
        try {
          // Cancel any existing Google Sign-In instances
          if (window.google.accounts.id) {
            try {
              window.google.accounts.id.cancel();
            } catch (e) {
              // Ignore cleanup errors
            }
          }

          // Initialize with minimal configuration to avoid CORS issues
          window.google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: handleGoogleCallback,
            auto_select: false,
            cancel_on_tap_outside: true
          });

          // Get the button container
          const buttonContainer = document.getElementById('google-signin-button');
          if (buttonContainer) {
            // Clear any existing content
            buttonContainer.innerHTML = '';
            
            // Render the Google Sign-In button with updated configuration
            window.google.accounts.id.renderButton(
              buttonContainer,
              {
                theme: 'outline',
                size: 'large',
                type: 'standard',
                text: 'signin_with',
                shape: 'rectangular',
                logo_alignment: 'left',
                width: 350,
                locale: 'en'
              }
            );
          }
          
          googleInitialized.current = true;
          setGoogleReady(true);
        } catch (error) {
          console.error('Google Sign-In initialization error:', error);
          // Don't show error to user if Google Sign-In fails to initialize
          // The regular login will still work
          console.warn('Google Sign-In not available, regular login still works');
        }
      } else {
        if (!GOOGLE_CLIENT_ID) {
          console.warn('Google Client ID not found in environment variables');
          // Don't show error to user, just log it
        }
      }
    };

    loadGoogleScript();
    
    // Cleanup function to prevent memory leaks
    cleanupRef.current = () => {
      if (window.google && window.google.accounts && window.google.accounts.id && googleInitialized.current) {
        try {
          window.google.accounts.id.cancel();
        } catch (error) {
          // Ignore cleanup errors
        }
      }
      googleInitialized.current = false;
    };

    return cleanupRef.current;
  }, []); // Empty dependency array to run only once

  const handleGoogleCallback = async (response) => {
    setGoogleLoading(true);
    setError('');

    try {
      const result = await fetch('https://resumebuilder-backend-dv7t.onrender.com/users/google-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          credential: response.credential
        }),
      });

      const data = await result.json();
      
      if (!result.ok) {
        throw new Error(data.message || 'Google login failed');
      }

      if (!data.token) {
        throw new Error('No authentication token received');
      }

      // Save token and userData
      localStorage.setItem('token', data.token);
      localStorage.setItem('userData', JSON.stringify(data.resumes));
      
      // Optionally save user info
      if (data.user) {
        localStorage.setItem('userInfo', JSON.stringify(data.user));
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Google login failed. Please try again.');
      console.error('Google login error:', err);
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
  
    try {
      if (!formData.email || !formData.password) {
        setError('Please fill in all fields');
        setLoading(false);
        return;
      }
      const response = await fetch('https://resumebuilder-backend-dv7t.onrender.com/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password : formData.password }),
      });
  
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
  
      if (!data.token) {
        throw new Error('No authentication token received');
      }
  
      // Save token and userData
      localStorage.setItem('token', data.token);
      localStorage.setItem('userData', JSON.stringify(data.resumes));
  
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to login. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const navigateToRegister = () => {
    navigate('/register');
  };

  return (
    <div className="auth-container">
      {/* Decorative elements */}
      <div className="decorative-elements">
        <div className="decoration decoration-1">
          <div className="decoration-gradient"></div>
        </div>
        <div className="decoration decoration-2">
          <div className="decoration-gradient"></div>
        </div>
        <div className="decoration decoration-3">
          <div className="decoration-gradient"></div>
        </div>
      </div>
      
      <div className="auth-card">
        {/* Welcome Section */}
        <div className="welcome-section">
          <div className="welcome-overlay"></div>
          
          <div className="welcome-content">
            <h1 className="welcome-title">
              WELCOME
            </h1>
            <h2 className="welcome-subtitle">
              RESUME BUILDER
            </h2>
            <p className="welcome-description">
            Login into your existing account in no time and start editing resumes before the deadline ends
            </p>
          </div>
        </div>
        
        {/* Form Section */}
        <div className="form-section">
          <div className="form-container">
            <h3 className="form-title">Sign in</h3>
            <p className="form-description">
              Enter into your existing account
            </p>

            {error && (
              <div className="error-message" style={{ 
                color: '#e74c3c', 
                backgroundColor: '#fdf2f2', 
                padding: '10px', 
                borderRadius: '4px', 
                marginBottom: '15px',
                fontSize: '14px'
              }}>
                {error}
              </div>
            )}

            <div className="form-fields">
              {/* Email Field */}
              <div className="input-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                />
              </div>

              {/* Password Field */}
              <div className="input-group">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="form-input password-input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Login Options */}
              <div className="login-options">
                <label className="remember-me">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    className="checkbox"
                  />
                  Remember me
                </label>
                <a href="#" className="forgot-password">
                  Forgot Password?
                </a>
              </div>

              {/* Submit Button */}
              <button 
                onClick={handleSubmit}
                className="submit-button"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>

              {/* Google Sign-In Button Container */}
              <div 
                id="google-signin-button" 
                style={{ 
                  width: '100%', 
                  marginTop: '15px',
                  display: 'flex',
                  justifyContent: 'center',
                  minHeight: googleReady ? '44px' : '0px',
                  transition: 'min-height 0.3s ease'
                }}
              ></div>

              {/* Loading indicator for Google Sign-In */}
              {googleLoading && (
                <div style={{ 
                  textAlign: 'center', 
                  marginTop: '10px',
                  fontSize: '14px',
                  color: '#666'
                }}>
                  Signing in with Google...
                </div>
              )}

              {/* Auth Switch */}
              <p className="auth-switch">
                Don't have an account? {' '}
                <button 
                  onClick={navigateToRegister}
                  className="auth-switch-button"
                >
                  Sign up
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;