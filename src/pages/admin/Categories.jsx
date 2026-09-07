import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';
import { productService } from '../../services/productService';
import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';
import { toast } from 'react-toastify';
import './Categories.css';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [saving, setSaving] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'ACTIVE',
  });

  useEffect(() => {
    fetchCategories();
  }, [page]);

  const fetchCategories = async () => {
    setLoading(true);
    setError('');
    try {
      console.log('Admin Categories: Fetching data from Products Service (admin endpoint)...');
      const response = await productService.getAllCategoriesAdmin();
      console.log('Admin Categories: response', response);
      setCategories(Array.isArray(response) ? response : response.content || []);
      setTotalPages(0); // Admin Service doesn't paginate categories
    } catch (err) {
      console.error('Admin Categories: Error fetching data', err);
      const errorMessage = err.message || 'Failed to fetch categories';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      description: '',
      status: 'ACTIVE',
    });
    setShowModal(true);
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      status: category.status || 'ACTIVE',
    });
    setShowModal(true);
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;

    try {
      await productService.deleteCategory(categoryId);
      toast.success('Category deleted successfully');
      fetchCategories();
    } catch (err) {
      const errorMessage = err.message || 'Failed to delete category';
      toast.error(errorMessage);
    }
  };

  const handleStatusToggle = async (categoryId, currentStatus) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      await productService.updateCategory(categoryId, { status: newStatus });
      toast.success(`Category ${newStatus.toLowerCase()} successfully`);
      fetchCategories();
    } catch (err) {
      const errorMessage = err.message || 'Failed to update category status';
      toast.error(errorMessage);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editingCategory) {
        await productService.updateCategory(editingCategory.id, formData);
        toast.success('Category updated successfully');
      } else {
        await productService.createCategory(formData);
        toast.success('Category created successfully');
      }
      setShowModal(false);
      fetchCategories();
    } catch (err) {
      const errorMessage = err.message || 'Failed to save category';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="admin-categories">
      <div className="page-header">
        <h1>Categories</h1>
        <button className="btn btn-primary" onClick={handleAddCategory}>
          <FaPlus />
          <span>Add Category</span>
        </button>
      </div>

      {error && <ErrorMessage message={error} onDismiss={() => setError('')} />}

      <div className="categories-table-container">
        <table className="categories-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id}>
                <td>{category.id}</td>
                <td>{category.name}</td>
                <td>{category.description || 'No description'}</td>
                <td>
                  <span className={`status-badge ${category.status?.toLowerCase()}`}>
                    {category.status}
                  </span>
                </td>
                <td>{new Date(category.createdAt).toLocaleDateString()}</td>
                <td>
                  <div className="table-actions">
                    <button
                      className="btn-icon"
                      onClick={() => handleEditCategory(category)}
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="btn-icon"
                      onClick={() => handleStatusToggle(category.id, category.status)}
                      title="Toggle Status"
                    >
                      {category.status === 'ACTIVE' ? '🔴' : '🟢'}
                    </button>
                    <button
                      className="btn-icon btn-icon-danger"
                      onClick={() => handleDeleteCategory(category.id)}
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {categories.length === 0 && (
          <div className="empty-state">No categories found. Add your first category to get started.</div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="btn btn-secondary"
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
          >
            Previous
          </button>
          <span>Page {page + 1} of {totalPages}</span>
          <button
            className="btn btn-secondary"
            onClick={() => setPage(p => p + 1)}
            disabled={page >= totalPages - 1}
          >
            Next
          </button>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingCategory ? 'Edit Category' : 'Add New Category'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="category-form">
              <div className="form-group">
                <label>Category Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter category name"
                  required
                  disabled={saving}
                  maxLength={100}
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter category description"
                  rows={3}
                  disabled={saving}
                  maxLength={500}
                />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  disabled={saving}
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? <Loading size="small" /> : editingCategory ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
