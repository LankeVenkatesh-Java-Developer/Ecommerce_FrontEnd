import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import store from './store/store';
import { ThemeProvider } from './contexts/ThemeContext';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';

// User Pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import OrderDetails from './pages/OrderDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import Unauthorized from './pages/Unauthorized';

// Admin Pages
import Dashboard from './pages/admin/Dashboard';
import Categories from './pages/admin/Categories';
import AdminProducts from './pages/admin/Products';
import Reports from './pages/admin/Reports';

// Test Page
import ApiTestPage from './pages/ApiTestPage';

function App() {
    return (
        <Provider store={store}>
            <ThemeProvider>
                <Router>
                    <Routes>

                        {/* ================= TEST PAGE ROUTE ================= */}

                        <Route
                            path="/api-test"
                            element={<ApiTestPage />}
                        />

                        {/* ================= USER ROUTES ================= */}

                        <Route
                            path="/"
                            element={
                                <MainLayout>
                                    <Home />
                                </MainLayout>
                            }
                        />

                        <Route
                            path="/products"
                            element={
                                <MainLayout>
                                    <Products />
                                </MainLayout>
                            }
                        />

                        <Route
                            path="/products/:id"
                            element={
                                <MainLayout>
                                    <ProductDetails />
                                </MainLayout>
                            }
                        />

                        <Route
                            path="/cart"
                            element={
                                <MainLayout>
                                    <Cart />
                                </MainLayout>
                            }
                        />

                        <Route
                            path="/checkout"
                            element={
                                <ProtectedRoute>
                                    <MainLayout>
                                        <Checkout />
                                    </MainLayout>
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/login"
                            element={
                                <MainLayout>
                                    <Login />
                                </MainLayout>
                            }
                        />

                        <Route
                            path="/register"
                            element={
                                <MainLayout>
                                    <Register />
                                </MainLayout>
                            }
                        />

                        <Route
                            path="/forgot-password"
                            element={
                                <MainLayout>
                                    <ForgotPassword />
                                </MainLayout>
                            }
                        />

                        <Route
                            path="/reset-password"
                            element={
                                <MainLayout>
                                    <ResetPassword />
                                </MainLayout>
                            }
                        />

                        <Route
                            path="/profile"
                            element={
                                <ProtectedRoute>
                                    <MainLayout>
                                        <Profile />
                                    </MainLayout>
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/orders"
                            element={
                                <ProtectedRoute>
                                    <MainLayout>
                                        <Orders />
                                    </MainLayout>
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/orders/:id"
                            element={
                                <ProtectedRoute>
                                    <MainLayout>
                                        <OrderDetails />
                                    </MainLayout>
                                </ProtectedRoute>
                            }
                        />

                        {/* ================= ADMIN ROUTES ================= */}

                        <Route
                            path="/admin"
                            element={
                                <ProtectedRoute requireAdmin>
                                    <AdminLayout>
                                        <Dashboard />
                                    </AdminLayout>
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/admin/categories"
                            element={
                                <ProtectedRoute requireAdmin>
                                    <AdminLayout>
                                        <Categories />
                                    </AdminLayout>
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/admin/products"
                            element={
                                <ProtectedRoute requireAdmin>
                                    <AdminLayout>
                                        <AdminProducts />
                                    </AdminLayout>
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/admin/reports"
                            element={
                                <ProtectedRoute requireAdmin>
                                    <AdminLayout>
                                        <Reports />
                                    </AdminLayout>
                                </ProtectedRoute>
                            }
                        />

                        {/* ================= 404 ================= */}

                        <Route
                            path="/unauthorized"
                            element={
                                <MainLayout>
                                    <Unauthorized />
                                </MainLayout>
                            }
                        />

                        <Route
                            path="/404"
                            element={
                                <MainLayout>
                                    <NotFound />
                                </MainLayout>
                            }
                        />

                        <Route
                            path="*"
                            element={<Navigate to="/404" replace />}
                        />

                    </Routes>

                    <ToastContainer />
                </Router>
            </ThemeProvider>
        </Provider>
    );
}

export default App;