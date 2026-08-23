# Sample Test Credentials

This document provides sample credentials for testing all functionalities of the ShopHub Ecommerce Frontend application.

## User Credentials

### Test User Account
- **Email:** `testuser@example.com`
- **Password:** `Test@1234`
- **First Name:** `John`
- **Last Name:** `Doe`
- **Mobile Number:** `9876543210`

### Alternative User Accounts
- **Email:** `jane@example.com`
- **Password:** `Jane@1234`
- **First Name:** `Jane`
- **Last Name:** `Smith`
- **Mobile Number:** `9876543211`

- **Email:** `bob@example.com`
- **Password:** `Bob@1234`
- **First Name:** `Bob`
- **Last Name:** `Johnson`
- **Mobile Number:** `9876543212`

## Admin Credentials

### Admin Account
- **Email:** `admin@shophub.com`
- **Password:** `Admin@1234`
- **First Name:** `Admin`
- **Last Name:** `User`
- **Mobile Number:** `9876543299`

## Testing Scenarios

### 1. User Registration
- Navigate to `/register`
- Use any of the alternative user credentials above
- Ensure mobile number follows Indian format (starts with 6-9, 10 digits)
- Password must be at least 8 characters

### 2. User Login
- Navigate to `/login`
- Use test user credentials: `testuser@example.com` / `Test@1234`
- Test with invalid credentials to see error handling
- Test forgot password functionality

### 3. Product Browsing
- Navigate to `/products`
- Test filtering by category
- Test search functionality
- Test price range filters
- Test sorting options (price, rating, name)

### 4. Shopping Cart
- Add products to cart as guest user
- Login and check cart persistence
- Update quantities
- Remove items
- Clear entire cart
- Test empty cart state

### 5. Checkout Process
- Add items to cart
- Navigate to `/checkout`
- Fill in shipping information
- Test payment flow (mock)
- Verify order creation

### 6. Order Management
- Navigate to `/orders`
- View order history
- Click on specific order to see details
- Test order status display

### 7. User Profile
- Navigate to `/profile`
- Update personal information
- Change password
- View account details

### 8. Admin Dashboard
- Login with admin credentials: `admin@shophub.com` / `Admin@1234`
- Navigate to `/admin`
- Test dashboard statistics
- Navigate to `/admin/categories` - manage categories
- Navigate to `/admin/products` - manage products
- Navigate to `/admin/reports` - view reports

## API Endpoints

The application uses the following backend services (configured in `.env`):

- **User Service:** `https://userservice-dp9v.onrender.com`
- **Admin Service:** `https://adminservice.onrender.com`

## Features to Test

### Dark/Light Mode
- Click the moon/sun icon in the navbar
- Verify theme persistence across page refreshes
- Check all components in both modes

### Responsive Design
- Test on mobile viewport (375px)
- Test on tablet viewport (768px)
- Test on desktop viewport (1280px+)
- Verify hamburger menu on mobile
- Check grid layouts adapt properly

### 3D Styling Effects
- Hover over product cards to see 3D lift effect
- Hover over buttons to see 3D press effect
- Check shadow effects on cards
- Verify smooth transitions

### Error Handling
- Test network errors (disable internet)
- Test invalid form submissions
- Test unauthorized access to protected routes
- Verify toast notifications appear correctly

## Browser Compatibility

Tested on:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Notes

- All passwords should be at least 8 characters long
- Mobile numbers must be valid Indian numbers (10 digits, starting with 6-9)
- The application uses localStorage for theme persistence
- Cart data is managed through the backend service
- All API calls are made using axios

## Troubleshooting

### Login Issues
- Verify backend services are running
- Check console for error messages
- Ensure credentials match exactly

### Cart Issues
- Clear browser localStorage if cart behaves unexpectedly
- Verify cart service API is accessible
- Check network tab in browser dev tools

### Theme Issues
- Clear localStorage to reset theme preference
- Check browser console for JavaScript errors
- Verify Tailwind CSS is loading correctly

### Styling Issues
- Ensure Tailwind CSS is properly configured
- Check that `tailwind.config.js` exists
- Verify PostCSS configuration is correct
- Run `npm run build` to check for build errors

## Support

For issues or questions:
- Check the console for error messages
- Verify backend service status
- Review network requests in browser dev tools
- Ensure all dependencies are installed (`npm install`)
