import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../store/slices/authSlice';
import { authService } from '../services/authService';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import { toast } from 'react-toastify';
import { setToken, setRole, setUser } from '../utils/tokenUtils';

const Login = () => {
  const [formData, setFormData] = useState({
    emailOrMobile: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      dispatch(loginStart());

      const response = await authService.login(formData);

      // Store token, user, and role in localStorage from login response
      setToken(response.token);
      setUser({ id: response.userId, email: response.email });
      setRole(response.role);

      dispatch(
        loginSuccess({
          user: { 
            id: response.userId, 
            email: response.email,
            role: response.role
          },
          token: response.token,
        })
      );

      toast.success('Login successful!');
      
      // Redirect based on role
      if (response.role === 'ADMIN' || response.role === 'SUPER_ADMIN') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Login failed';
      setError(errorMessage);
      dispatch(loginFailure(errorMessage));
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full card-3d-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome Back</h1>
          <p className="text-gray-600 dark:text-gray-400">Sign in to your account</p>
        </div>

        {error && <ErrorMessage message={error} onDismiss={() => setError('')} />}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              id="emailOrMobile"
              name="emailOrMobile"
              value={formData.emailOrMobile}
              onChange={handleChange}
              required
              placeholder="Enter your email or mobile"
              disabled={loading}
              className="input-3d"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
              disabled={loading}
              className="input-3d"
            />
          </div>

          <div className="flex items-center justify-between">
            <Link to="/forgot-password" className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors">
              Forgot password?
            </Link>
          </div>

          <button type="submit" className="btn-primary-3d w-full" disabled={loading}>
            {loading ? <Loading size="small" /> : 'Sign In'}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600 dark:text-gray-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium transition-colors">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
