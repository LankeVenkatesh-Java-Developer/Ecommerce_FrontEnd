import React, { useState } from 'react';
import { FaFileExcel, FaDownload, FaCalendar } from 'react-icons/fa';
import { orderService } from '../../services/orderService';
import { productService } from '../../services/productService';
import { toast } from 'react-toastify';
import './Reports.css';

const Reports = () => {
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: '',
  });

  const handleDateChange = (e) => {
    setDateRange({ ...dateRange, [e.target.name]: e.target.value });
  };

  const generateOrdersReport = async () => {
    setLoading(true);
    try {
      const orders = await orderService.getOrders(0);
      
      const csv = [
        ['Order ID', 'Customer ID', 'Date', 'Status', 'Subtotal', 'Shipping', 'Tax', 'Total'],
        ...orders.map(order => [
          order.id,
          order.userId,
          new Date(order.createdAt).toLocaleDateString(),
          order.status,
          order.subtotal.toFixed(2),
          order.shippingCost.toFixed(2),
          order.tax.toFixed(2),
          order.total.toFixed(2),
        ])
      ].map(row => row.join(',')).join('\n');

      downloadCSV(csv, 'orders-report.csv');
      toast.success('Orders report generated successfully');
    } catch (err) {
      console.error('Failed to generate report:', err);
      toast.error('Failed to generate orders report');
    } finally {
      setLoading(false);
    }
  };

  const generateProductsReport = async () => {
    setLoading(true);
    try {
      const data = await productService.getAllProducts({ pageSize: 1000 });
      
      const csv = [
        ['Product ID', 'Name', 'SKU', 'Brand', 'Category ID', 'Price', 'Stock Quantity', 'Status'],
        ...data.products.map(product => [
          product.id,
          product.name,
          product.sku,
          product.brand,
          product.categoryId || 'N/A',
          product.price.toFixed(2),
          product.stockQuantity,
          product.status,
        ])
      ].map(row => row.join(',')).join('\n');

      downloadCSV(csv, 'products-report.csv');
      toast.success('Products report generated successfully');
    } catch (err) {
      console.error('Failed to generate report:', err);
      toast.error('Failed to generate products report');
    } finally {
      setLoading(false);
    }
  };

  const generateSalesReport = async () => {
    setLoading(true);
    try {
      const orders = await orderService.getOrders(0);
      
      const salesData = orders.reduce((acc, order) => {
        if (order.status === 'DELIVERED') {
          acc.totalRevenue += order.total;
          acc.totalOrders += 1;
        }
        return acc;
      }, { totalRevenue: 0, totalOrders: 0 });

      const csv = [
        ['Metric', 'Value'],
        ['Total Revenue', salesData.totalRevenue.toFixed(2)],
        ['Total Delivered Orders', salesData.totalOrders],
        ['Average Order Value', salesData.totalOrders > 0 ? (salesData.totalRevenue / salesData.totalOrders).toFixed(2) : '0.00'],
        ['Report Generated', new Date().toLocaleString()],
      ].map(row => row.join(',')).join('\n');

      downloadCSV(csv, 'sales-report.csv');
      toast.success('Sales report generated successfully');
    } catch (err) {
      console.error('Failed to generate report:', err);
      toast.error('Failed to generate sales report');
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = (csv, filename) => {
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="admin-reports">
      <h1>Reports</h1>
      <p className="dashboard-subtitle">Generate and download reports in CSV format</p>

      <div className="reports-grid">
        <div className="report-card">
          <div className="report-icon orders">
            <FaFileExcel />
          </div>
          <div className="report-content">
            <h3>Orders Report</h3>
            <p>Download complete orders data including status, amounts, and customer information.</p>
            <button
              className="btn btn-primary"
              onClick={generateOrdersReport}
              disabled={loading}
            >
              <FaDownload />
              <span>{loading ? 'Generating...' : 'Generate Report'}</span>
            </button>
          </div>
        </div>

        <div className="report-card">
          <div className="report-icon products">
            <FaFileExcel />
          </div>
          <div className="report-content">
            <h3>Products Report</h3>
            <p>Download complete products inventory including pricing, stock, and status.</p>
            <button
              className="btn btn-primary"
              onClick={generateProductsReport}
              disabled={loading}
            >
              <FaDownload />
              <span>{loading ? 'Generating...' : 'Generate Report'}</span>
            </button>
          </div>
        </div>

        <div className="report-card">
          <div className="report-icon sales">
            <FaFileExcel />
          </div>
          <div className="report-content">
            <h3>Sales Report</h3>
            <p>Download sales summary including total revenue, delivered orders, and metrics.</p>
            <button
              className="btn btn-primary"
              onClick={generateSalesReport}
              disabled={loading}
            >
              <FaDownload />
              <span>{loading ? 'Generating...' : 'Generate Report'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="date-filter-section">
        <h3><FaCalendar /> Filter by Date Range</h3>
        <div className="date-filters">
          <div className="form-group">
            <label>Start Date</label>
            <input
              type="date"
              name="startDate"
              value={dateRange.startDate}
              onChange={handleDateChange}
            />
          </div>
          <div className="form-group">
            <label>End Date</label>
            <input
              type="date"
              name="endDate"
              value={dateRange.endDate}
              onChange={handleDateChange}
            />
          </div>
          <button
            className="btn btn-secondary"
            onClick={() => setDateRange({ startDate: '', endDate: '' })}
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default Reports;
