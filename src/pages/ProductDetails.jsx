import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaShoppingCart, FaStar, FaArrowLeft, FaCheck } from 'react-icons/fa';
import { productService } from '../services/productService';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import { toast } from 'react-toastify';
import { cartService } from '../services/cartService';
import './ProductDetails.css';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    setError('');

    try {
      const data = await productService.getProductById(parseInt(id));
      setProduct(data);
      setSelectedImage(0);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch product';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value >= 1 && value <= (product?.quantity || 0)) {
      setQuantity(value);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;

    try {
      await cartService.addToCart(null, product, quantity);
      window.dispatchEvent(new Event('cartUpdated'));
      toast.success(`Added ${quantity} item(s) to cart!`);
    } catch (error) {
      console.error('Failed to add to cart:', error);
      toast.error('Failed to add to cart');
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error || !product) {
    return (
      <div className="product-details-container">
        <ErrorMessage message={error || 'Product not found'} onDismiss={() => setError('')} />
        <Link to="/products" className="back-link">
          <FaArrowLeft />
          <span>Back to Products</span>
        </Link>
      </div>
    );
  }

  const images = [product.imageUrl, product.imageUrl]; // In real app, this would be multiple images

  return (
    <div className="product-details-container">
      <Link to="/products" className="back-link">
        <FaArrowLeft />
        <span>Back to Products</span>
      </Link>

      <div className="product-details">
        {/* Product Images */}
        <div className="product-gallery">
          <div className="main-image">
            <img src={images[selectedImage]} alt={product.name} />
          </div>
          <div className="thumbnail-list">
            {images.map((img, index) => (
              <button
                key={index}
                className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                onClick={() => setSelectedImage(index)}
              >
                <img src={img} alt={`${product.name} ${index + 1}`} />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="product-info">
          <div className="product-brand">{product.brand}</div>
          <h1 className="product-name">{product.name}</h1>
          
          <div className="product-rating">
            <div className="stars">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className={i < Math.floor(product.rating) ? 'filled' : ''} />
              ))}
            </div>
            <span className="rating-value">{product.rating}</span>
            <span className="reviews">({product.reviews} reviews)</span>
          </div>

          <div className="product-price">
            <span className="current-price">${product.price ? Number(product.price).toFixed(2) : '0.00'}</span>
            {product.quantity < 10 && product.quantity > 0 && (
              <span className="stock-warning">Only {product.quantity} left in stock!</span>
            )}
          </div>

          <div className="product-description">
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>

          <div className="product-meta">
            <div className="meta-item">
              <span className="meta-label">SKU:</span>
              <span className="meta-value">{product.sku}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Availability:</span>
              <span className={`meta-value ${product.quantity > 0 ? 'in-stock' : 'out-of-stock'}`}>
                {product.quantity > 0 ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Category:</span>
              <span className="meta-value">{product.category?.name || 'N/A'}</span>
            </div>
          </div>

          {product.quantity > 0 ? (
            <div className="product-actions">
              <div className="quantity-selector">
                <button
                  className="quantity-btn"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={handleQuantityChange}
                  min="1"
                  max={product.quantity}
                />
                <button
                  className="quantity-btn"
                  onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
                  disabled={quantity >= product.quantity}
                >
                  +
                </button>
              </div>

              <button
                className="add-to-cart-btn"
                onClick={handleAddToCart}
                disabled={quantity > product.quantity}
              >
                <FaShoppingCart />
                <span>Add to Cart</span>
              </button>
            </div>
          ) : (
            <div className="out-of-stock-message">
              <p>This product is currently out of stock.</p>
            </div>
          )}

          <div className="product-features">
            <h3>Key Features</h3>
            <ul>
              <li><FaCheck /> High quality materials</li>
              <li><FaCheck /> 1 year warranty</li>
              <li><FaCheck /> Free shipping on orders over $50</li>
              <li><FaCheck /> 30-day return policy</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
