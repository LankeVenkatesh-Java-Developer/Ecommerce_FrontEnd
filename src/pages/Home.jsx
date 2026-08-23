import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaStar, FaArrowRight } from 'react-icons/fa';
import { productService } from '../services/productService';
import Loading from '../components/Loading';
import { toast } from 'react-toastify';
import { cartService } from '../services/cartService';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, categoriesData] = await Promise.all([
          productService.getAllProducts({ pageSize: 8 }),
          productService.getAllCategories(),
        ]);
        setFeaturedProducts(productsData.products);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        toast.error('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddToCart = async (product) => {
    try {
      await cartService.addToCart(null, product, 1);
      window.dispatchEvent(new Event('cartUpdated'));
      toast.success('Added to cart!');
    } catch (error) {
      console.error('Failed to add to cart:', error);
      toast.error('Failed to add to cart');
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-500 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20 lg:py-32">
        <div className="absolute inset-0 bg-black/10 dark:bg-black/30"></div>
        <div className="container-custom relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-slide-up">
              Welcome to ShopHub
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              Discover amazing products at unbeatable prices
            </p>
            <Link 
              to="/products" 
              className="inline-flex items-center btn-3d bg-white text-primary-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-xl shadow-2xl animate-slide-up"
              style={{ animationDelay: '0.2s' }}
            >
              <span>Shop Now</span>
              <FaArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-secondary-500/20 rounded-full blur-xl animate-float" style={{ animationDelay: '1s' }}></div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Browse Categories
            </h2>
            <p className="text-gray-600 dark:text-gray-400">Find what you're looking for</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/products?category=${category.id}`}
                className="group relative overflow-hidden rounded-2xl shadow-3d hover:shadow-3d-lg hover:-translate-y-1 transition-all duration-300 transform-gpu"
              >
                <div className="aspect-square">
                  <img 
                    src={category.imageUrl} 
                    alt={category.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-semibold text-lg">{category.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Featured Products
              </h2>
              <p className="text-gray-600 dark:text-gray-400">Handpicked just for you</p>
            </div>
            <Link 
              to="/products" 
              className="hidden md:flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium transition-colors"
            >
              View All <FaArrowRight className="ml-2" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <div key={product.id} className="card-3d group">
                <Link to={`/products/${product.id}`} className="block relative overflow-hidden rounded-t-xl">
                  <div className="aspect-square">
                    <img 
                      src={product.imageUrl} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  {product.stockQuantity === 0 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white font-semibold px-4 py-2 bg-red-500 rounded-lg">Out of Stock</span>
                    </div>
                  )}
                </Link>
                <div className="p-4">
                  <Link to={`/products/${product.id}`} className="block">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{product.brand}</p>
                  <div className="flex items-center mb-3">
                    <FaStar className="text-yellow-400 mr-1" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{product.rating}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">({product.reviews})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
                      ${product.price.toFixed(2)}
                    </span>
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stockQuantity === 0}
                      className="btn-primary-3d p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FaShoppingCart />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center md:hidden">
            <Link 
              to="/products" 
              className="btn-primary-3d inline-flex items-center"
            >
              View All <FaArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="card-3d p-6 text-center hover:scale-105 transition-transform duration-300">
              <div className="text-4xl mb-4">🚚</div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Free Shipping</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">On orders over $50</p>
            </div>
            <div className="card-3d p-6 text-center hover:scale-105 transition-transform duration-300">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Secure Payment</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">100% secure checkout</p>
            </div>
            <div className="card-3d p-6 text-center hover:scale-105 transition-transform duration-300">
              <div className="text-4xl mb-4">↩️</div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Easy Returns</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">30-day return policy</p>
            </div>
            <div className="card-3d p-6 text-center hover:scale-105 transition-transform duration-300">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">24/7 Support</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Dedicated support team</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
