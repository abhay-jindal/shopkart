# 🛒 ShopKart - Full Stack E-commerce Application

A modern, feature-rich e-commerce platform built with React frontend and FastAPI backend, providing a complete online shopping experience.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Authentication](#authentication)
- [Payment Integration](#payment-integration)
- [Contributing](#contributing)
- [License](#license)

## 🚀 Overview

ShopKart is a comprehensive e-commerce solution that provides a seamless online shopping experience. The application features a modern React frontend with a robust FastAPI backend, complete with user authentication, product management, shopping cart functionality, order processing, and payment integration.

### Key Highlights

- **Modern UI/UX**: Built with React and Tailwind CSS for a responsive, beautiful interface
- **Secure Authentication**: JWT-based authentication with access and refresh tokens
- **Real-time Cart**: Persistent shopping cart with real-time updates
- **Payment Integration**: Razorpay payment gateway integration
- **Order Management**: Complete order lifecycle management
- **Responsive Design**: Mobile-first approach for all devices

## ✨ Features

### 🔐 Authentication & Authorization
- User registration and login
- JWT-based authentication with refresh tokens
- Role-based access control (User/Admin)
- Secure password hashing with bcrypt
- Protected routes and API endpoints

### 🛍️ Product Management
- Product catalog with categories
- Product variants and specifications
- Advanced search and filtering
- Product detail pages with images
- Inventory management

### 🛒 Shopping Cart
- Add/remove products from cart
- Quantity management
- Real-time cart updates
- Persistent cart across sessions
- Cart summary and calculations

### 📍 Address Management
- Multiple address support
- Address validation
- Default address selection
- Address CRUD operations

### 💳 Payment & Orders
- Razorpay payment gateway integration
- Secure payment processing
- Order confirmation and tracking
- Order history and status updates
- Payment status tracking
- **On-demand invoice PDF generation** - Download professional invoices instantly

### 📱 User Experience
- Responsive design for all devices
- Smooth animations with Framer Motion
- Toast notifications for user feedback
- Loading states and error handling
- Intuitive navigation

## 🛠️ Tech Stack

### Frontend
- **React 19.1.0** - Modern JavaScript library for building user interfaces
- **React Router DOM 6.22.0** - Client-side routing
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **Framer Motion 12.7.3** - Animation library
- **Axios 1.8.4** - HTTP client for API calls
- **Formik 2.4.6** - Form management
- **Yup 1.6.1** - Schema validation
- **React Toastify 11.0.5** - Toast notifications
- **Lucide React 0.488.0** - Icon library
- **JWT Decode 4.0.0** - JWT token handling

### Backend
- **FastAPI 0.115.12** - Modern, fast web framework for building APIs
- **SQLAlchemy 2.0.40** - SQL toolkit and ORM
- **Pydantic 2.11.3** - Data validation using Python type annotations
- **Uvicorn 0.34.1** - ASGI server
- **Python-Jose 3.4.0** - JWT implementation
- **Passlib 1.7.4** - Password hashing
- **Bcrypt 4.3.0** - Password hashing library
- **Razorpay 1.4.2** - Payment gateway integration
- **Python-dotenv 1.1.0** - Environment variable management

### Database
- **SQLite** - Lightweight, serverless database
- **SQLAlchemy ORM** - Object-relational mapping

## 📁 Project Structure

```
shopkart/
├── frontend/                 # React frontend application
│   ├── public/              # Static files
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context providers
│   │   ├── routes/         # Routing configuration
│   │   ├── utils/          # Utility functions
│   │   └── img/            # Image assets
│   ├── package.json
│   └── tailwind.config.js
├── backend/                 # FastAPI backend application
│   ├── core/
│   │   ├── config/         # Configuration files
│   │   ├── database/       # Database setup
│   │   ├── models/         # SQLAlchemy models
│   │   ├── routers/        # API route handlers
│   │   ├── schemas/        # Pydantic schemas
│   │   ├── services/       # Business logic
│   │   └── utils/          # Utility functions
│   ├── scripts/            # Database scripts
│   ├── main.py            # FastAPI application entry point
│   ├── requirements.txt    # Python dependencies
│   └── shopkart.db        # SQLite database
└── README.md
```

## 🚀 Installation

### Prerequisites
- Node.js (v16 or higher)
- Python (v3.8 or higher)
- pip (Python package manager)

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will be available at `http://localhost:3000`

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment (recommended):
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Start the backend server:
```bash
python main.py
```

The backend API will be available at `http://localhost:8000`

### Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
# JWT Settings
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Razorpay Settings (for payment integration)
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-secret

# Database
DATABASE_URL=sqlite:///./shopkart.db
```

## 📖 Usage

### Starting the Application

1. **Start the Backend Server:**
```bash
cd backend
python main.py
```

2. **Start the Frontend Development Server:**
```bash
cd frontend
npm start
```

3. **Access the Application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

### User Flow

1. **Registration/Login**: Users can register or login to access the platform
2. **Browse Products**: View product catalog with categories and search functionality
3. **Product Details**: View detailed product information and variants
4. **Add to Cart**: Add products to shopping cart with quantity selection
5. **Manage Cart**: View cart, update quantities, and remove items
6. **Checkout**: Proceed to checkout with address and payment
7. **Payment**: Complete payment using Razorpay integration
8. **Order Confirmation**: Receive order confirmation and tracking details

## 📚 API Documentation

The API documentation is automatically generated using FastAPI's built-in Swagger UI. Access it at `http://localhost:8000/docs` when the backend is running.

### Available Endpoints

All API endpoints are prefixed with `/api`:

#### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token

#### Products
- `GET /api/products/` - Get all products with pagination
- `GET /api/products/{id}` - Get product by ID
- `GET /api/products/search/` - Search products
- `GET /api/product/categories/` - Get product categories

#### Cart & Orders
- `GET /api/cart/` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update` - Update cart item
- `DELETE /api/cart/remove/{item_id}` - Remove item from cart

#### Addresses
- `GET /api/account/addresses/` - Get user addresses
- `POST /api/account/addresses/` - Add new address
- `PUT /api/account/addresses/{id}` - Update address
- `DELETE /api/account/addresses/{id}` - Delete address

#### Orders
- `POST /api/orders/` - Create new order
- `GET /api/orders/` - Get user orders
- `GET /api/orders/{id}` - Get order details
- `GET /api/orders/{id}/invoice` - Download invoice PDF for order

#### Payments
- `POST /api/payment/order` - Create payment intent
- `POST /api/payment/verify` - Verify payment

#### Product Variants
- `POST /api/product/variants/` - Get variants by IDs
- `POST /api/product/variants/bulk` - Add bulk variants

## 🗄️ Database Schema

The application uses SQLite with the following main entities:

### Users
- User authentication and profile information
- JWT token management

### Products
- Product information, categories, and variants
- Inventory management

### Cart
- Shopping cart items with quantities
- User-specific cart management

### Orders
- Order details, status, and payment information
- Order history tracking

### Addresses
- User address management
- Multiple address support

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for authentication:

- **Access Tokens**: Short-lived tokens for API access
- **Refresh Tokens**: Long-lived tokens for token renewal
- **Secure Storage**: Tokens stored securely in cookies
- **Automatic Renewal**: Automatic token refresh on expiration

### Security Features
- Password hashing with bcrypt
- CORS configuration for frontend-backend communication
- Input validation with Pydantic schemas
- SQL injection prevention with SQLAlchemy ORM

## 💳 Payment Integration

The application integrates with Razorpay for payment processing:

- **Secure Payments**: PCI DSS compliant payment processing
- **Multiple Payment Methods**: Credit cards, debit cards, UPI, net banking
- **Payment Verification**: Server-side payment verification
- **Order Confirmation**: Automatic order confirmation on successful payment

## 🎨 UI/UX Features

- **Responsive Design**: Mobile-first approach
- **Modern UI**: Clean, intuitive interface
- **Smooth Animations**: Framer Motion animations
- **Loading States**: Skeleton loaders and loading indicators
- **Error Handling**: User-friendly error messages
- **Toast Notifications**: Real-time user feedback

## 🧪 Testing

### Frontend Testing
```bash
cd frontend
npm test
```

### Backend Testing
```bash
cd backend
python -m pytest
```

## 🚀 Deployment

### Frontend Deployment
```bash
cd frontend
npm run build
```

### Backend Deployment
The FastAPI application can be deployed using:
- **Uvicorn**: Production ASGI server
- **Docker**: Containerized deployment
- **Cloud Platforms**: AWS, Google Cloud, Heroku

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow PEP 8 for Python code
- Use ESLint and Prettier for JavaScript/React code
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [FastAPI](https://fastapi.tiangolo.com/) for the excellent web framework
- [React](https://reactjs.org/) for the frontend library
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Razorpay](https://razorpay.com/) for payment gateway integration
- [Framer Motion](https://www.framer.com/motion/) for animations

## 📞 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team
- Check the API documentation at `http://localhost:8000/docs`

---

**Happy Shopping! 🛒✨**
