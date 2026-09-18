import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import { toast } from 'react-toastify';
import './Auth.css';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState(1); // 1: email, 2: otp, 3: new password
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      const response = await authService.forgotPassword(email);
      setMessage(response);
      setStep(2);
      toast.success('OTP has been sent to your email address');
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to send OTP';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');

    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      const isValid = await authService.verifyOtp(email, otp);
      if (isValid) {
        setStep(3);
        setMessage('OTP verified successfully');
        toast.success('OTP verified successfully');
      } else {
        setError('Invalid OTP. Please try again.');
        toast.error('Invalid OTP');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'OTP verification failed';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!newPassword || newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      setError('Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await authService.resetPassword({ email, otp, newPassword });
      setMessage(response);
      toast.success('Password reset successful. Please login with your new password.');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Password reset failed';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Reset Password</h1>
        
        {error && <ErrorMessage message={error} onDismiss={() => setError('')} />}
        {message && <div className="success-message" style={{ color: 'green', marginBottom: '1rem' }}>{message}</div>}
        
        {step === 1 && (
          <>
            <p className="auth-subtitle">Enter your email address to receive a password reset OTP</p>
            <form onSubmit={handleRequestOtp} className="auth-form">
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your registered email"
                  disabled={loading}
                  required
                />
              </div>

              <div className="form-actions">
                <Link to="/login" className="btn btn-secondary">
                  Back to Login
                </Link>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? <Loading size="small" /> : 'Send OTP'}
                </button>
              </div>
            </form>
          </>
        )}
        
        {step === 2 && (
          <>
            <p className="auth-subtitle">Enter the 6-digit OTP sent to your email</p>
            <form onSubmit={handleVerifyOtp} className="auth-form">
              <div className="form-group">
                <label>Enter OTP</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  maxLength={6}
                  placeholder="Enter 6-digit OTP"
                  disabled={loading}
                />
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setStep(1)}>
                  Back
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? <Loading size="small" /> : 'Verify OTP'}
                </button>
              </div>
            </form>
          </>
        )}
        
        {step === 3 && (
          <>
            <p className="auth-subtitle">Enter your new password</p>
            <form onSubmit={handleResetPassword} className="auth-form">
              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  placeholder="Enter new password (min 8 characters)"
                  disabled={loading}
                />
              </div>
              <div className="form-group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Confirm new password"
                  disabled={loading}
                />
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setStep(2)}>
                  Back
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? <Loading size="small" /> : 'Reset Password'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
