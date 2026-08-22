// Placeholder service with mock data - to be replaced with real backend API calls
import { PRODUCT_ENDPOINTS, CATEGORY_ENDPOINTS } from '../api/endpoints';

// Mock product data
const mockProducts = [
  {
    id: 1,
    categoryId: 1,
    name: 'Wireless Bluetooth Headphones',
    description: 'High-quality wireless headphones with noise cancellation and 30-hour battery life.',
    sku: 'WBH-001',
    price: 149.99,
    stockQuantity: 50,
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
    brand: 'AudioTech',
    active: true,
    rating: 4.5,
    reviews: 128,
  },
  {
    id: 2,
    categoryId: 1,
    name: 'Smart Watch Pro',
    description: 'Advanced smartwatch with health monitoring, GPS, and 7-day battery life.',
    sku: 'SWP-002',
    price: 299.99,
    stockQuantity: 30,
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
    brand: 'TechWatch',
    active: true,
    rating: 4.7,
    reviews: 256,
  },
  {
    id: 3,
    categoryId: 2,
    name: 'Laptop 15-inch',
    description: 'Powerful laptop with 16GB RAM, 512GB SSD, and Intel i7 processor.',
    sku: 'LP-003',
    price: 999.99,
    stockQuantity: 20,
    imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500',
    brand: 'CompTech',
    active: true,
    rating: 4.8,
    reviews: 89,
  },
  {
    id: 4,
    categoryId: 2,
    name: 'Wireless Mouse',
    description: 'Ergonomic wireless mouse with precision tracking and long battery life.',
    sku: 'WM-004',
    price: 49.99,
    stockQuantity: 100,
    imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500',
    brand: 'MousePro',
    active: true,
    rating: 4.3,
    reviews: 312,
  },
  {
    id: 5,
    categoryId: 3,
    name: 'Running Shoes',
    description: 'Lightweight running shoes with cushioned sole and breathable mesh.',
    sku: 'RS-005',
    price: 129.99,
    stockQuantity: 45,
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
    brand: 'SportMax',
    active: true,
    rating: 4.6,
    reviews: 178,
  },
  {
    id: 6,
    categoryId: 3,
    name: 'Yoga Mat Premium',
    description: 'Extra thick yoga mat with non-slip surface and carrying strap.',
    sku: 'YM-006',
    price: 39.99,
    stockQuantity: 80,
    imageUrl: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500',
    brand: 'YogaLife',
    active: true,
    rating: 4.4,
    reviews: 95,
  },
  {
    id: 7,
    categoryId: 4,
    name: 'Coffee Maker Deluxe',
    description: 'Programmable coffee maker with built-in grinder and thermal carafe.',
    sku: 'CM-007',
    price: 189.99,
    stockQuantity: 25,
    imageUrl: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500',
    brand: 'BrewMaster',
    active: true,
    rating: 4.9,
    reviews: 203,
  },
  {
    id: 8,
    categoryId: 4,
    name: 'Non-Stick Cookware Set',
    description: '10-piece non-stick cookware set with heat-resistant handles.',
    sku: 'CS-008',
    price: 249.99,
    stockQuantity: 35,
    imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500',
    brand: 'KitchenPro',
    active: true,
    rating: 4.5,
    reviews: 147,
  },
];

// Mock category data
const mockCategories = [
  {
    id: 1,
    name: 'Electronics',
    description: 'Latest electronic gadgets and accessories',
    imageUrl: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500',
    sortOrder: 1,
    active: true,
  },
  {
    id: 2,
    name: 'Computers',
    description: 'Laptops, desktops, and computer accessories',
    imageUrl: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=500',
    sortOrder: 2,
    active: true,
  },
  {
    id: 3,
    name: 'Sports & Fitness',
    description: 'Sports equipment and fitness gear',
    imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500',
    sortOrder: 3,
    active: true,
  },
  {
    id: 4,
    name: 'Home & Kitchen',
    description: 'Home appliances and kitchen essentials',
    imageUrl: 'https://images.unsplash.com/photo-1556909114-44e3e70034e2?w=500',
    sortOrder: 4,
    active: true,
  },
];

export const productService = {
  getAllProducts: async (filters = {}) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    let filteredProducts = [...mockProducts];

    // Filter by category
    if (filters.categoryId) {
      filteredProducts = filteredProducts.filter(p => p.categoryId === filters.categoryId);
    }

    // Filter by search term
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredProducts = filteredProducts.filter(p =>
        p.name.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower)
      );
    }

    // Filter by price range
    if (filters.minPrice) {
      filteredProducts = filteredProducts.filter(p => p.price >= filters.minPrice);
    }
    if (filters.maxPrice) {
      filteredProducts = filteredProducts.filter(p => p.price <= filters.maxPrice);
    }

    // Sort
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'price-asc':
          filteredProducts.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          filteredProducts.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          filteredProducts.sort((a, b) => b.rating - a.rating);
          break;
        case 'name':
          filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
          break;
        default:
          break;
      }
    }

    // Pagination
    const page = filters.page || 1;
    const pageSize = filters.pageSize || 12;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    return {
      products: paginatedProducts,
      total: filteredProducts.length,
      page,
      pageSize,
      totalPages: Math.ceil(filteredProducts.length / pageSize),
    };
  },

  getProductById: async (productId) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const product = mockProducts.find(p => p.id === productId);
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  },

  getProductsByCategory: async (categoryId) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return mockProducts.filter(p => p.categoryId === categoryId);
  },

  searchProducts: async (searchTerm) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const searchLower = searchTerm.toLowerCase();
    return mockProducts.filter(p =>
      p.name.toLowerCase().includes(searchLower) ||
      p.description.toLowerCase().includes(searchLower)
    );
  },

  getAllCategories: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockCategories;
  },

  getCategoryById: async (categoryId) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const category = mockCategories.find(c => c.id === categoryId);
    if (!category) {
      throw new Error('Category not found');
    }
    return category;
  },

  // Category CRUD operations (placeholder)
  createCategory: async (categoryData) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const newCategory = {
      id: mockCategories.length + 1,
      ...categoryData,
      sortOrder: mockCategories.length + 1,
      active: true,
    };
    mockCategories.push(newCategory);
    return newCategory;
  },

  updateCategory: async (categoryId, categoryData) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = mockCategories.findIndex(c => c.id === categoryId);
    if (index === -1) {
      throw new Error('Category not found');
    }
    mockCategories[index] = { ...mockCategories[index], ...categoryData };
    return mockCategories[index];
  },

  deleteCategory: async (categoryId) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = mockCategories.findIndex(c => c.id === categoryId);
    if (index === -1) {
      throw new Error('Category not found');
    }
    mockCategories.splice(index, 1);
    return { success: true };
  },

  // Product CRUD operations (placeholder)
  createProduct: async (productData) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const newProduct = {
      id: mockProducts.length + 1,
      ...productData,
      status: productData.status || 'ACTIVE',
      active: productData.active !== false,
      rating: 0,
      reviews: 0,
    };
    mockProducts.push(newProduct);
    return newProduct;
  },

  updateProduct: async (productId, productData) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = mockProducts.findIndex(p => p.id === productId);
    if (index === -1) {
      throw new Error('Product not found');
    }
    mockProducts[index] = { 
      ...mockProducts[index], 
      ...productData,
      status: productData.status || mockProducts[index].status || 'ACTIVE',
    };
    return mockProducts[index];
  },

  deleteProduct: async (productId) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = mockProducts.findIndex(p => p.id === productId);
    if (index === -1) {
      throw new Error('Product not found');
    }
    mockProducts.splice(index, 1);
    return { success: true };
  },
};
