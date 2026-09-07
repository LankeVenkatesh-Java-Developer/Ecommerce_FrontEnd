import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaFilter } from 'react-icons/fa';
import { productService } from '../../services/productService';
import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';
import { toast } from 'react-toastify';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [saving, setSaving] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [filters, setFilters] = useState({
    search: '',
    categoryId: '',
    status: '',
    minPrice: '',
    maxPrice: '',
  });

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    categoryId: '',
    brand: '',
    sku: '',
    status: 'ACTIVE',
  });

  useEffect(() => {
    fetchData();
  }, [page]);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      console.log('Admin Products: Fetching data from Products Service (admin endpoints)...');
      const [productsData, categoriesData] = await Promise.all([
        productService.getAllProductsAdmin({ page, size: 20, sort: 'name,asc' }),
        productService.getAllCategoriesAdmin(),
      ]);
      console.log('Admin Products: productsData', productsData);
      console.log('Admin Products: categoriesData', categoriesData);
      setProducts(productsData.content || productsData || []);
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
      setTotalPages(productsData.totalPages || productsData.pageable?.totalPages || 0);
    } catch (err) {
      console.error('Admin Products: Error fetching data', err);
      const errorMessage = err.message || 'Failed to fetch data';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const searchParams = {
        page: 0,
        size: 20,
      };
      if (filters.search) searchParams.search = filters.search;
      if (filters.categoryId && filters.categoryId !== '') searchParams.categoryId = filters.categoryId;
      if (filters.status) searchParams.status = filters.status;

      const response = await productService.getAllProducts(searchParams);
      setProducts(response.content || []);
      setTotalPages(response.totalPages || 0);
      setPage(0);
    } catch (err) {
      const errorMessage = err.message || 'Failed to search products';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      categoryId: '',
      status: '',
      minPrice: '',
      maxPrice: '',
    });
    setPage(0);
    fetchData();
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      quantity: '',
      categoryId: '',
      brand: '',
      sku: '',
      status: 'ACTIVE',
    });
    setShowModal(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price,
      quantity: product.quantity,
      categoryId: product.categoryId || '',
      brand: product.brand,
      sku: product.sku,
      status: product.status || 'ACTIVE',
    });
    setShowModal(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      await productService.deleteProduct(productId);
      toast.success('Product deleted successfully');
      fetchData();
    } catch (err) {
      const errorMessage = err.message || 'Failed to delete product';
      toast.error(errorMessage);
    }
  };

  const handleStatusToggle = async (productId, currentStatus) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      await productService.updateProductStatus(productId, newStatus);
      toast.success(`Product ${newStatus.toLowerCase()} successfully`);
      fetchData();
    } catch (err) {
      const errorMessage = err.message || 'Failed to update product status';
      toast.error(errorMessage);
    }
  };

  const handleStockUpdate = async (productId, currentStock) => {
    const newStock = prompt('Enter new stock quantity:', currentStock);
    if (newStock === null || newStock === '') return;
    
    const quantity = parseInt(newStock);
    if (isNaN(quantity) || quantity < 0) {
      toast.error('Please enter a valid stock quantity');
      return;
    }

    try {
      const product = await productService.getProductById(productId);
      await productService.updateProduct(productId, { ...product, quantity: quantity });
      toast.success('Stock updated successfully');
      fetchData();
    } catch (err) {
      const errorMessage = err.message || 'Failed to update stock';
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
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
        categoryId: parseInt(formData.categoryId),
      };

      if (editingProduct) {
        await productService.updateProduct(editingProduct.id, productData);
        toast.success('Product updated successfully');
      } else {
        await productService.createProduct(productData);
        toast.success('Product created successfully');
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      const errorMessage = err.message || 'Failed to save product';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    console.log('Admin Products: Still loading...');
    return <Loading />;
  }

  return (
    <div className="admin-products">
      <div className="page-header">
        <h1>Products</h1>
        <button className="btn btn-primary" onClick={handleAddProduct}>
          <FaPlus />
          <span>Add Product</span>
        </button>
      </div>

      {error && <ErrorMessage message={error} onDismiss={() => setError('')} />}

      {/* Filters */}
      <div className="filters-bar">
        <div className="filter-group">
          <FaSearch />
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            placeholder="Search products..."
          />
        </div>
        <div className="filter-group">
          <FaFilter />
          <select name="categoryId" value={filters.categoryId} onChange={handleFilterChange}>
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <select name="status" value={filters.status} onChange={handleFilterChange}>
            <option value="">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="OUT_OF_STOCK">Out of Stock</option>
          </select>
        </div>
        <div className="filter-group">
          <input
            type="number"
            name="minPrice"
            value={filters.minPrice}
            onChange={handleFilterChange}
            placeholder="Min Price"
            min="0"
            step="0.01"
          />
        </div>
        <div className="filter-group">
          <input
            type="number"
            name="maxPrice"
            value={filters.maxPrice}
            onChange={handleFilterChange}
            placeholder="Max Price"
            min="0"
            step="0.01"
          />
        </div>
        <button className="btn btn-secondary" onClick={handleSearch}>
          Search
        </button>
        <button className="btn btn-secondary" onClick={handleResetFilters}>
          Reset
        </button>
      </div>

      {/* Products Table */}
      <div className="products-table-container">
        <table className="products-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>SKU</th>
              <th>Category</th>
              <th>Brand</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>
                  <div className="product-name-cell">
                    <span className="product-name">{product.name}</span>
                  </div>
                </td>
                <td>{product.sku}</td>
                <td>{product.category?.name || product.categoryName || categories.find((c) => c.id === product.categoryId)?.name || '-'}</td>
                <td>{product.brand}</td>
                <td>${product.price ? Number(product.price).toFixed(2) : '0.00'}</td>
                <td>
                  <span 
                    className={product.quantity > 10 ? 'stock-ok' : 'stock-low'}
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleStockUpdate(product.id, product.quantity)}
                    title="Click to update stock"
                  >
                    {product.quantity}
                  </span>
                </td>
                <td>
                  <span className={`status-badge ${product.status?.toLowerCase()}`}>
                    {product.status}
                  </span>
                </td>
                <td>
                  <div className="table-actions">
                    <button
                      className="btn-icon"
                      onClick={() => handleEditProduct(product)}
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="btn-icon"
                      onClick={() => handleStatusToggle(product.id, product.status)}
                      title="Toggle Status"
                    >
                      {product.status === 'ACTIVE' ? '🔴' : '🟢'}
                    </button>
                    <button
                      className="btn-icon btn-icon-danger"
                      onClick={() => handleDeleteProduct(product.id)}
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
        {products.length === 0 && (
          <div className="empty-state">No products found matching your criteria.</div>
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
          <div className="modal-content modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className="product-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Product Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter product name"
                    required
                    disabled={saving}
                    maxLength={200}
                  />
                </div>
                <div className="form-group">
                  <label>SKU *</label>
                  <input
                    type="text"
                    name="sku"
                    value={formData.sku}
                    onChange={handleChange}
                    placeholder="Enter SKU"
                    required
                    disabled={saving}
                    maxLength={50}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Brand *</label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    placeholder="Enter brand"
                    required
                    disabled={saving}
                    maxLength={100}
                  />
                </div>
                <div className="form-group">
                  <label>Category *</label>
                  <select
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleChange}
                    required
                    disabled={saving}
                  >
                    <option value="">Select category</option>
                    {categories.filter(c => !c.status || c.status === 'ACTIVE').map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Price *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    required
                    disabled={saving}
                  />
                </div>
                <div className="form-group">
                  <label>Stock Quantity *</label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                    required
                    disabled={saving}
                  />
                </div>
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
                  <option value="OUT_OF_STOCK">Out of Stock</option>
                </select>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter product description"
                  rows={4}
                  disabled={saving}
                  maxLength={1000}
                />
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
                  {saving ? <Loading size="small" /> : editingProduct ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
