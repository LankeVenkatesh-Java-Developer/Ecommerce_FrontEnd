import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaStar, FaArrowRight } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { productService } from '../services/productService';
import Loading from '../components/Loading';
import { ProductCardSkeleton, CategoryCardSkeleton } from '../components/SkeletonLoader';
import { toast } from 'react-toastify';
import { cartService } from '../services/cartService';
import { setCart } from '../store/slices/cartSlice';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, categoriesData] = await Promise.all([
          productService.getAllProducts({ page: 0, size: 8 }),
          productService.getAllCategories(),
        ]);
        setFeaturedProducts(productsData.content || productsData || []);
        setCategories(Array.isArray(categoriesData) ? categoriesData : categoriesData.content || []);
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

  if (loading) {
    return (
      <div className="min-h-screen">
        {/* Promo Banner Skeleton */}
        <div className="bg-gradient-to-r from-accent-500 to-secondary-500 text-white py-3">
          <div className="container-custom text-center">
            <div className="h-5 w-64 mx-auto bg-white/20 rounded animate-pulse"></div>
          </div>
        </div>

        {/* Hero Section Skeleton */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-500 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20 lg:py-32">
          <div className="container-custom relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <div className="h-16 w-3/4 mx-auto bg-white/20 rounded-lg animate-pulse mb-6"></div>
              <div className="h-8 w-full mx-auto bg-white/10 rounded-lg animate-pulse mb-8"></div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <div className="h-14 w-40 bg-white/20 rounded-xl animate-pulse"></div>
                <div className="h-14 w-40 bg-white/10 rounded-xl animate-pulse"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section Skeleton */}
        <section className="py-16 bg-white dark:bg-gray-800">
          <div className="container-custom">
            <div className="text-center mb-12">
              <div className="h-10 w-64 mx-auto bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse mb-4"></div>
              <div className="h-6 w-48 mx-auto bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <CategoryCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products Section Skeleton */}
        <section className="py-16 bg-gray-50 dark:bg-gray-900">
          <div className="container-custom">
            <div className="flex justify-between items-center mb-12">
              <div>
                <div className="h-10 w-48 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse mb-2"></div>
                <div className="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
              </div>
              <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse hidden md:block"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </section>

        {/* Features Section Skeleton */}
        <section className="py-16 bg-white dark:bg-gray-800">
          <div className="container-custom">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="card-3d p-6 text-center">
                  <div className="h-16 w-16 mx-auto bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse mb-4"></div>
                  <div className="h-6 w-32 mx-auto bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse mb-2"></div>
                  <div className="h-4 w-24 mx-auto bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Promo Banner */}
      <div className="bg-gradient-to-r from-accent-500 to-secondary-500 text-white py-3">
        <div className="container-custom text-center">
          <p className="text-sm font-medium">🎉 Free Shipping on Orders Over $50! Use Code: <span className="font-bold">FREESHIP</span></p>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-500 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20 lg:py-32">
        <div className="absolute inset-0 bg-black/10 dark:bg-black/30"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yIDItNCAyLTRzLTItMi0yLTRjMC0yDQo8L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>
        <div className="container-custom relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-slide-up">
              Welcome to ShopHub
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              Discover amazing products at unbeatable prices
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <Link 
                to="/products" 
                className="inline-flex items-center btn-3d bg-white text-primary-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-xl shadow-2xl"
              >
                <span>Shop Now</span>
                <FaArrowRight className="ml-2" />
              </Link>
              <Link 
                to="/products?category=1" 
                className="inline-flex items-center btn-3d bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm px-8 py-4 text-lg font-semibold rounded-xl border-2 border-white/30"
              >
                <span>New Arrivals</span>
              </Link>
            </div>
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
