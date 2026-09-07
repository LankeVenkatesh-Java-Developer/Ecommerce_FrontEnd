import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaSearch, FaBars, FaTimes, FaSignOutAlt, FaMoon, FaSun } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { authService } from '../services/authService';
import { cartService } from '../services/cartService';
import { useTheme } from '../contexts/ThemeContext';
import Notifications from './Notifications';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartItemCount, setCartItemCount] = useState(0);

  const { isAuthenticated, user, role } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode, toggleTheme } = useTheme();

  useEffect(() => {
    const updateCartCount = () => {
      const count = cartService.getCartItemCount();
      setCartItemCount(count);
    };

    updateCartCount();

    // Listen for cart updates
    window.addEventListener('cartUpdated', updateCartCount);

    return () => {
      window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, []);

  const handleLogout = () => {
    authService.logout();
    dispatch(logout());
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMobileMenuOpen(false);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 glass-effect border-b border-gray-200 dark:border-gray-700">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex-shrink-0">
            <Link to="/" onClick={closeMobileMenu} className="flex items-center">
              <h1 className="text-2xl font-bold gradient-text">ShopHub</h1>
            </Link>
          </div>

          {/* Search - Desktop */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-3d pl-10 pr-4"
              />
              <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary-500 transition-colors">
                <FaSearch />
              </button>
            </form>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme} 
              title="Toggle theme"
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 hover:scale-110"
            >
              {isDarkMode ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-primary-500" />}
            </button>

            {/* Notifications */}
            {isAuthenticated && <Notifications />}

            {/* Mobile Menu Toggle */}
            <button 
              onClick={toggleMobileMenu}
              className="md:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300"
            >
              {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/" className="nav-link text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 font-medium transition-colors" onClick={closeMobileMenu}>
                Home
              </Link>
              <Link to="/products" className="nav-link text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 font-medium transition-colors" onClick={closeMobileMenu}>
                Products
              </Link>

              {isAuthenticated ? (
                <>
                  <Link to="/cart" className="relative nav-link text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 font-medium transition-colors flex items-center" onClick={closeMobileMenu}>
                    <FaShoppingCart />
                    <span className="ml-2">Cart</span>
                    {cartItemCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-lg">
                        {cartItemCount}
                      </span>
                    )}
                  </Link>
                  <Link to="/orders" className="nav-link text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 font-medium transition-colors" onClick={closeMobileMenu}>
                    Orders
                  </Link>
                  <Link to="/profile" className="nav-link text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 font-medium transition-colors flex items-center" onClick={closeMobileMenu}>
                    <FaUser />
                    <span className="ml-2">Profile</span>
                  </Link>
                  {/* Admin Links - Only show to admins */}
                  {(role === 'ADMIN' || role === 'SUPER_ADMIN') && (
                    <>
                      <Link to="/admin" className="nav-link text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium transition-colors" onClick={closeMobileMenu}>
                        Admin
                      </Link>
                      <Link to="/admin/products" className="nav-link text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium transition-colors" onClick={closeMobileMenu}>
                        Products
                      </Link>
                      <Link to="/admin/categories" className="nav-link text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium transition-colors" onClick={closeMobileMenu}>
                        Categories
                      </Link>
                    </>
                  )}
                  <button 
                    onClick={handleLogout} 
                    className="btn-danger-3d text-sm px-4 py-2 flex items-center"
                  >
                    <FaSignOutAlt />
                    <span className="ml-2">Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="nav-link text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 font-medium transition-colors" onClick={closeMobileMenu}>
                    Login
                  </Link>
                  <Link to="/register" className="btn-primary-3d text-sm px-4 py-2" onClick={closeMobileMenu}>
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'} pb-4`}>
          {/* Mobile Search */}
          <form onSubmit={handleSearch} className="mb-4">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-3d"
            />
          </form>

          <div className="flex flex-col space-y-3">
            <Link to="/" className="nav-link text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 font-medium transition-colors py-2" onClick={closeMobileMenu}>
              Home
            </Link>
            <Link to="/products" className="nav-link text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 font-medium transition-colors py-2" onClick={closeMobileMenu}>
              Products
            </Link>

            {isAuthenticated ? (
              <>
                <Link to="/cart" className="relative nav-link text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 font-medium transition-colors py-2 flex items-center" onClick={closeMobileMenu}>
                  <FaShoppingCart />
                  <span className="ml-2">Cart</span>
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-primary-500 to-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-lg">
                      {cartItemCount}
                    </span>
                  )}
                </Link>
                <Link to="/orders" className="nav-link text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 font-medium transition-colors py-2" onClick={closeMobileMenu}>
                  Orders
                </Link>
                <Link to="/profile" className="nav-link text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 font-medium transition-colors py-2 flex items-center" onClick={closeMobileMenu}>
                  <FaUser />
                  <span className="ml-2">Profile</span>
                </Link>
                {/* Admin Links - Only show to admins */}
                {(role === 'ADMIN' || role === 'SUPER_ADMIN') && (
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Admin</p>
                    <Link to="/admin" className="nav-link text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium transition-colors py-2" onClick={closeMobileMenu}>
                      Dashboard
                    </Link>
                    <Link to="/admin/products" className="nav-link text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium transition-colors py-2" onClick={closeMobileMenu}>
                      Products
                    </Link>
                    <Link to="/admin/categories" className="nav-link text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium transition-colors py-2" onClick={closeMobileMenu}>
                      Categories
                    </Link>
                  </div>
                )}
                <button 
                  onClick={handleLogout} 
                  className="btn-danger-3d text-sm py-3 flex items-center justify-center"
                >
                  <FaSignOutAlt />
                  <span className="ml-2">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 font-medium transition-colors py-2" onClick={closeMobileMenu}>
                  Login
                </Link>
                <Link to="/register" className="btn-primary-3d text-sm py-3" onClick={closeMobileMenu}>
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
