import React, { useState } from 'react';
import { FaFileExcel, FaDownload } from 'react-icons/fa';
import adminManagementService from '../../services/adminManagementService';
import { toast } from 'react-toastify';
import './Reports.css';

const Reports = () => {
  const [loading, setLoading] = useState({
    products: false,
    categories: false,
    stock: false,
  });

  const downloadProductReport = async () => {
    setLoading({ ...loading, products: true });
    try {
      await adminManagementService.downloadProductReport();
      toast.success('Products report downloaded successfully');
    } catch (err) {
      const errorMessage = err.message || 'Failed to download products report';
      toast.error(errorMessage);
    } finally {
      setLoading({ ...loading, products: false });
    }
  };

  const downloadCategoryReport = async () => {
    setLoading({ ...loading, categories: true });
    try {
      await adminManagementService.downloadCategoryReport();
      toast.success('Categories report downloaded successfully');
    } catch (err) {
      const errorMessage = err.message || 'Failed to download categories report';
      toast.error(errorMessage);
    } finally {
      setLoading({ ...loading, categories: false });
    }
  };

  const downloadStockReport = async () => {
    setLoading({ ...loading, stock: true });
    try {
      await adminManagementService.downloadStockReport();
      toast.success('Stock report downloaded successfully');
    } catch (err) {
      const errorMessage = err.message || 'Failed to download stock report';
      toast.error(errorMessage);
    } finally {
      setLoading({ ...loading, stock: false });
    }
  };

  return (
    <div className="admin-reports">
      <h1>Reports</h1>
      <p className="dashboard-subtitle">Generate and download Excel reports for products, categories, and stock</p>

      <div className="reports-grid">
        <div className="report-card">
          <div className="report-icon products">
            <FaFileExcel />
          </div>
          <div className="report-content">
            <h3>Products Report</h3>
            <p>Download complete products inventory including pricing, stock, status, and category information in Excel format.</p>
            <button
              className="btn btn-primary"
              onClick={downloadProductReport}
              disabled={loading.products}
            >
              <FaDownload />
              <span>{loading.products ? 'Downloading...' : 'Download Report'}</span>
            </button>
          </div>
        </div>

        <div className="report-card">
          <div className="report-icon categories">
            <FaFileExcel />
          </div>
          <div className="report-content">
            <h3>Categories Report</h3>
            <p>Download complete categories data including names, descriptions, and status in Excel format.</p>
            <button
              className="btn btn-primary"
              onClick={downloadCategoryReport}
              disabled={loading.categories}
            >
              <FaDownload />
              <span>{loading.categories ? 'Downloading...' : 'Download Report'}</span>
            </button>
          </div>
        </div>

        <div className="report-card">
          <div className="report-icon stock">
            <FaFileExcel />
          </div>
          <div className="report-content">
            <h3>Stock Report</h3>
            <p>Download detailed stock information including product names, SKU, quantities, and availability status in Excel format.</p>
            <button
              className="btn btn-primary"
              onClick={downloadStockReport}
              disabled={loading.stock}
            >
              <FaDownload />
              <span>{loading.stock ? 'Downloading...' : 'Download Report'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="reports-info">
        <h3>Report Information</h3>
        <ul>
          <li><strong>Products Report:</strong> Contains all product details including ID, name, SKU, brand, category, price, stock quantity, and status.</li>
          <li><strong>Categories Report:</strong> Contains all category details including ID, name, description, status, and timestamps.</li>
          <li><strong>Stock Report:</strong> Contains stock-level information for all products with current quantities and availability status.</li>
        </ul>
        <p className="reports-note">
          <em>Note: All reports are generated in Excel (.xlsx) format and can be opened in Microsoft Excel, Google Sheets, or other spreadsheet applications.</em>
        </p>
      </div>
    </div>
  );
};

export default Reports;
