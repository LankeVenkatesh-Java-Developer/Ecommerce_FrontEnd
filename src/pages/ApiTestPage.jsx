import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const ApiTestPage = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedService, setSelectedService] = useState('all');

  const addResult = (service, endpoint, method, status, data, error = null) => {
    setResults(prev => [...prev, {
      id: Date.now(),
      service,
      endpoint,
      method,
      status,
      data,
      error,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const clearResults = () => setResults([]);

  // User Service Tests
  const testUserService = async () => {
    setLoading(true);
    const baseUrl = import.meta.env.VITE_USER_SERVICE_URL || 'http://localhost:8081';
    
    try {
      // Test health endpoint
      await axios.get(`${baseUrl}/actuator/health`).then(res => {
        addResult('User Service', '/actuator/health', 'GET', res.status, res.data);
      });
    } catch (error) {
      addResult('User Service', '/actuator/health', 'GET', error.response?.status || 0, null, error.message);
    }

    try {
      // Test register endpoint
      const testUser = {
        email: `test${Date.now()}@example.com`,
        password: 'Test@123',
        firstName: 'Test',
        lastName: 'User',
        mobile: '9876543210'
      };
      await axios.post(`${baseUrl}/api/v1/auth/register`, testUser).then(res => {
        addResult('User Service', '/api/v1/auth/register', 'POST', res.status, res.data);
      });
    } catch (error) {
      addResult('User Service', '/api/v1/auth/register', 'POST', error.response?.status || 0, null, error.message);
    }

    try {
      // Test login endpoint
      await axios.post(`${baseUrl}/api/v1/auth/login`, {
        emailOrMobile: 'test@example.com',
        password: 'Test@123'
      }).then(res => {
        addResult('User Service', '/api/v1/auth/login', 'POST', res.status, res.data);
      });
    } catch (error) {
      addResult('User Service', '/api/v1/auth/login', 'POST', error.response?.status || 0, null, error.message);
    }

    setLoading(false);
  };

  // Products Service Tests
  const testProductsService = async () => {
    setLoading(true);
    const baseUrl = import.meta.env.VITE_PRODUCTS_SERVICE_URL || 'http://localhost:8082';
    
    try {
      // Test health endpoint
      await axios.get(`${baseUrl}/actuator/health`).then(res => {
        addResult('Products Service', '/actuator/health', 'GET', res.status, res.data);
      });
    } catch (error) {
      addResult('Products Service', '/actuator/health', 'GET', error.response?.status || 0, null, error.message);
    }

    try {
      // Test get all categories
      await axios.get(`${baseUrl}/api/categories`).then(res => {
        addResult('Products Service', '/api/categories', 'GET', res.status, res.data);
      });
    } catch (error) {
      addResult('Products Service', '/api/categories', 'GET', error.response?.status || 0, null, error.message);
    }

    try {
      // Test get all products
      await axios.get(`${baseUrl}/api/products?page=0&size=10`).then(res => {
        addResult('Products Service', '/api/products', 'GET', res.status, res.data);
      });
    } catch (error) {
      addResult('Products Service', '/api/products', 'GET', error.response?.status || 0, null, error.message);
    }

    try {
      // Test admin categories endpoint
      await axios.get(`${baseUrl}/api/categories/admin/all`).then(res => {
        addResult('Products Service', '/api/categories/admin/all', 'GET', res.status, res.data);
      });
    } catch (error) {
      addResult('Products Service', '/api/categories/admin/all', 'GET', error.response?.status || 0, null, error.message);
    }

    try {
      // Test admin products endpoint
      await axios.get(`${baseUrl}/api/products/admin/all?page=0&size=10`).then(res => {
        addResult('Products Service', '/api/products/admin/all', 'GET', res.status, res.data);
      });
    } catch (error) {
      addResult('Products Service', '/api/products/admin/all', 'GET', error.response?.status || 0, null, error.message);
    }

    setLoading(false);
  };

  // Admin Service Tests
  const testAdminService = async () => {
    setLoading(true);
    const baseUrl = import.meta.env.VITE_ADMIN_SERVICE_URL || 'http://localhost:8083';
    
    try {
      // Test health endpoint
      await axios.get(`${baseUrl}/actuator/health`).then(res => {
        addResult('Admin Service', '/actuator/health', 'GET', res.status, res.data);
      });
    } catch (error) {
      addResult('Admin Service', '/actuator/health', 'GET', error.response?.status || 0, null, error.message);
    }

    try {
      // Test admin categories endpoint
      await axios.get(`${baseUrl}/api/admin/categories`).then(res => {
        addResult('Admin Service', '/api/admin/categories', 'GET', res.status, res.data);
      });
    } catch (error) {
      addResult('Admin Service', '/api/admin/categories', 'GET', error.response?.status || 0, null, error.message);
    }

    try {
      // Test admin products endpoint
      await axios.get(`${baseUrl}/api/admin/products?page=0&size=10`).then(res => {
        addResult('Admin Service', '/api/admin/products', 'GET', res.status, res.data);
      });
    } catch (error) {
      addResult('Admin Service', '/api/admin/products', 'GET', error.response?.status || 0, null, error.message);
    }

    setLoading(false);
  };

  // Order Service Tests
  const testOrderService = async () => {
    setLoading(true);
    const baseUrl = import.meta.env.VITE_ORDER_SERVICE_URL || 'http://localhost:8084';
    
    try {
      // Test health endpoint
      await axios.get(`${baseUrl}/actuator/health`).then(res => {
        addResult('Order Service', '/actuator/health', 'GET', res.status, res.data);
      });
    } catch (error) {
      addResult('Order Service', '/actuator/health', 'GET', error.response?.status || 0, null, error.message);
    }

    try {
      // Test get orders endpoint
      await axios.get(`${baseUrl}/api/v1/orders/user/1`).then(res => {
        addResult('Order Service', '/api/v1/orders/user/1', 'GET', res.status, res.data);
      });
    } catch (error) {
      addResult('Order Service', '/api/v1/orders/user/1', 'GET', error.response?.status || 0, null, error.message);
    }

    setLoading(false);
  };

  const testAllServices = async () => {
    clearResults();
    await Promise.all([
      testUserService(),
      testProductsService(),
      testAdminService(),
      testOrderService()
    ]);
    toast.success('All services tested!');
  };

  const runSelectedTests = () => {
    clearResults();
    if (selectedService === 'all' || selectedService === 'user') {
      testUserService();
    }
    if (selectedService === 'all' || selectedService === 'products') {
      testProductsService();
    }
    if (selectedService === 'all' || selectedService === 'admin') {
      testAdminService();
    }
    if (selectedService === 'all' || selectedService === 'order') {
      testOrderService();
    }
  };

  const getStatusColor = (status) => {
    if (status >= 200 && status < 300) return 'text-green-600 bg-green-100';
    if (status >= 400 && status < 500) return 'text-yellow-600 bg-yellow-100';
    if (status >= 500) return 'text-red-600 bg-red-100';
    return 'text-gray-600 bg-gray-100';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Microservices API Test Dashboard</h1>
        
        {/* Service Configuration */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Service Configuration</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">User Service</label>
              <input
                type="text"
                defaultValue={import.meta.env.VITE_USER_SERVICE_URL}
                className="w-full px-3 py-2 border rounded-md bg-gray-50"
                disabled
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Products Service</label>
              <input
                type="text"
                defaultValue={import.meta.env.VITE_PRODUCTS_SERVICE_URL}
                className="w-full px-3 py-2 border rounded-md bg-gray-50"
                disabled
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Admin Service</label>
              <input
                type="text"
                defaultValue={import.meta.env.VITE_ADMIN_SERVICE_URL}
                className="w-full px-3 py-2 border rounded-md bg-gray-50"
                disabled
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Order Service</label>
              <input
                type="text"
                defaultValue={import.meta.env.VITE_ORDER_SERVICE_URL}
                className="w-full px-3 py-2 border rounded-md bg-gray-50"
                disabled
              />
            </div>
          </div>
        </div>

        {/* Test Controls */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Controls</h2>
          <div className="flex flex-wrap gap-4 items-center">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Service</label>
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="px-4 py-2 border rounded-md"
              >
                <option value="all">All Services</option>
                <option value="user">User Service</option>
                <option value="products">Products Service</option>
                <option value="admin">Admin Service</option>
                <option value="order">Order Service</option>
              </select>
            </div>
            <button
              onClick={runSelectedTests}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? 'Testing...' : 'Run Tests'}
            </button>
            <button
              onClick={testAllServices}
              disabled={loading}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400"
            >
              {loading ? 'Testing...' : 'Test All Services'}
            </button>
            <button
              onClick={clearResults}
              className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Clear Results
            </button>
          </div>
        </div>

        {/* Test Results */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Test Results</h2>
          {results.length === 0 ? (
            <p className="text-gray-500">No test results yet. Click "Run Tests" to start testing.</p>
          ) : (
            <div className="space-y-3">
              {results.map((result) => (
                <div key={result.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-gray-900">{result.service}</span>
                      <span className="px-2 py-1 text-xs font-mono rounded bg-blue-100 text-blue-800">
                        {result.method}
                      </span>
                      <span className="text-sm text-gray-600">{result.endpoint}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 text-sm font-semibold rounded ${getStatusColor(result.status)}`}>
                        {result.status}
                      </span>
                      <span className="text-xs text-gray-500">{result.timestamp}</span>
                    </div>
                  </div>
                  {result.error ? (
                    <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                      <strong>Error:</strong> {result.error}
                    </div>
                  ) : (
                    <div className="mt-2 p-3 bg-gray-50 rounded">
                      <details>
                        <summary className="cursor-pointer text-sm font-medium text-gray-700">View Response</summary>
                        <pre className="mt-2 text-xs overflow-auto max-h-40">
                          {JSON.stringify(result.data, null, 2)}
                        </pre>
                      </details>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Service Status Summary */}
        <div className="bg-white rounded-lg shadow p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">Service Status Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {['User Service', 'Products Service', 'Admin Service', 'Order Service'].map((service) => {
              const serviceResults = results.filter(r => r.service === service);
              const successCount = serviceResults.filter(r => r.status >= 200 && r.status < 300).length;
              const totalCount = serviceResults.length;
              const status = totalCount === 0 ? 'pending' : successCount === totalCount ? 'success' : 'partial';
              
              return (
                <div key={service} className="border rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">{service}</h3>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${
                      status === 'success' ? 'bg-green-500' : 
                      status === 'partial' ? 'bg-yellow-500' : 'bg-gray-300'
                    }`} />
                    <span className="text-sm text-gray-600">
                      {totalCount === 0 ? 'Not tested' : `${successCount}/${totalCount} passed`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiTestPage;
