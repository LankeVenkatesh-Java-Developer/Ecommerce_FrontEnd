import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FaShoppingCart, FaStar, FaFilter, FaSlidersH } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { productService } from '../services/productService';
import Loading from '../components/Loading';
import { ProductCardSkeleton } from '../components/SkeletonLoader';
import ErrorMessage from '../components/ErrorMessage';
import { toast } from 'react-toastify';
import { cartService } from '../services/cartService';
import { setCart } from '../store/slices/cartSlice';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [filters, setFilters] = useState({
    categoryId: searchParams.get('category') || '',
    search: searchParams.get('search') || '',
    minPrice: '',
    maxPrice: '',
    sortBy: '',
  });

  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 12,
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [filters, pagination.page]);

  const fetchCategories = async () => {
    try {
      const data = await productService.getAllCategories();
      setCategories(Array.isArray(data) ? data : data.content || []);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    setError('');

    try {
      const params = {
        page: pagination.page - 1,
        size: pagination.pageSize,
      };
      if (filters.categoryId) params.categoryId = filters.categoryId;
      if (filters.search) params.search = filters.search;
      if (filters.sortBy) params.sort = filters.sortBy === 'price-asc' ? 'price,asc' : filters.sortBy === 'price-desc' ? 'price,desc' : 'name,asc';

      const data = await productService.getAllProducts(params);
      const products = data.content || data || [];
      setProducts(products);
      setPagination({
        page: (data.pageable?.pageNumber || 0) + 1,
        pageSize: data.pageable?.pageSize || pagination.pageSize,
        total: data.totalElements || products.length,
        totalPages: data.totalPages || 1,
      });
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch products';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
    setPagination({ ...pagination, page: 1 });
  };

  const handleSortChange = (e) => {
    setFilters({ ...filters, sortBy: e.target.value });
    setPagination({ ...pagination, page: 1 });
  };

  const handlePageChange = (newPage) => {
    setPagination({ ...pagination, page: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToCart = async (product) => {
    try {
      await cartService.addToCart(user?.id, product, 1);
      const updatedCart = await cartService.getCart(user?.id);
      dispatch(setCart(updatedCart));
      window.dispatchEvent(new Event('cartUpdated'));
      toast.success('Added to cart!');
    } catch (error) {
      console.error('Failed to add to cart:', error);
      toast.error('Failed to add to cart');
    }
  };

  const clearFilters = () => {
    setFilters({
      categoryId: '',
      search: '',
      minPrice: '',
      maxPrice: '',
      sortBy: '',
    });
    setPagination({ ...pagination, page: 1 });
    setSearchParams({});
  };

  return (
    <div className="container-custom py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 md:mb-0">Products</h1>
        <button
          className="md:hidden btn-secondary-3d flex items-center justify-center"
          onClick={() => setShowFilters(!showFilters)}
        >
          <FaFilter />
          <span className="ml-2">Filters</span>
        </button>
      </div>

      {error && <ErrorMessage message={error} onDismiss={() => setError('')} />}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className={`lg:w-64 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
          <div className="card-3d p-6 sticky top-24">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <FaSlidersH className="mr-2" />
                Filters
              </h3>
              <button className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300" onClick={clearFilters}>
                Clear All
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
                <select
                  name="categoryId"
                  value={filters.categoryId}
                  onChange={handleFilterChange}
                  className="input-3d"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Search</label>
                <input
                  type="text"
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  placeholder="Search products..."
                  className="input-3d"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Price Range</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    name="minPrice"
                    value={filters.minPrice}
                    onChange={handleFilterChange}
                    placeholder="Min"
                    min="0"
                    className="input-3d flex-1"
                  />
                  <span className="text-gray-500">-</span>
                  <input
                    type="number"
                    name="maxPrice"
                    value={filters.maxPrice}
                    onChange={handleFilterChange}
                    placeholder="Max"
                    min="0"
                    className="input-3d flex-1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Sort By</label>
                <select
                  name="sortBy"
                  value={filters.sortBy}
                  onChange={handleSortChange}
                  className="input-3d"
                >
                  <option value="">Default</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                  <option value="name">Name A-Z</option>
                </select>
              </div>
            </div>
          </div>
        </aside>

        {/* Products Grid */}
        <main className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(12)].map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="card-3d p-16 text-center">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">No Products Found</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                We couldn't find any products matching your search criteria. Try adjusting your filters or search terms.
              </p>
              <button className="btn-primary-3d inline-flex items-center" onClick={clearFilters}>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Clear All Filters
              </button>
            </div>
          ) : (
            <>
              <div className="mb-6 text-gray-600 dark:text-gray-400">
                Showing {products.length} of {pagination.total} products
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div key={product.id} className="card-3d group relative">
                    <Link to={`/products/${product.id}`} className="block relative overflow-hidden rounded-t-xl">
                      <div className="aspect-square relative">
                        <img 
                          src={product.imageUrl} 
                          alt={product.name} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                        />
                        {/* Quick Actions Overlay */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              handleAddToCart(product);
                            }}
                            disabled={product.quantity === 0}
                            className="bg-white text-gray-900 p-3 rounded-full hover:bg-primary-500 hover:text-white transition-all duration-300 transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Add to Cart"
                          >
                            <FaShoppingCart />
                          </button>
                        </div>
                      </div>
                      {/* Badges */}
                      <div className="absolute top-2 left-2 flex flex-col gap-1">
                        {product.quantity === 0 && (
                          <span className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg animate-pulse">Out of Stock</span>
                        )}
                        {product.quantity > 0 && product.quantity < 10 && (
                          <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">Low Stock</span>
                        )}
                        {product.id % 3 === 0 && product.quantity > 0 && (
                          <span className="bg-gradient-to-r from-accent-500 to-accent-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">New</span>
                        )}
                        {product.id % 5 === 0 && product.quantity > 0 && (
                          <span className="bg-gradient-to-r from-secondary-500 to-secondary-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">-20%</span>
                        )}
                      </div>
                      {/* Wishlist Button */}
                      <button className="absolute top-2 right-2 bg-white/90 dark:bg-gray-800/90 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-500 hover:text-white transform hover:scale-110">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>
                    </Link>
                    <div className="p-4">
                      <Link to={`/products/${product.id}`} className="block">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2 hover:text-primary-600 dark:hover:text-primary-400 transition-colors text-lg">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 font-medium">{product.brand}</p>
                      <div className="flex items-center mb-3">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <FaStar key={i} className={`text-sm ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`} />
                          ))}
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white ml-2">{product.rating}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">({product.reviews})</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                            ${product.price ? Number(product.price).toFixed(2) : '0.00'}
                          </span>
                          {product.id % 5 === 0 && (
                            <span className="text-sm text-gray-400 line-through font-medium">
                              ${(product.price * 1.25).toFixed(2)}
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => handleAddToCart(product)}
                          disabled={product.quantity === 0}
                          className="btn-primary-3d p-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform"
                        >
                          <FaShoppingCart />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2 mt-8">
                  <button
                    className="btn-secondary-3d px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                  >
                    Previous
                  </button>
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                        pagination.page === page
                          ? 'btn-primary-3d'
                          : 'btn-secondary-3d'
                      }`}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    className="btn-secondary-3d px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Products;
