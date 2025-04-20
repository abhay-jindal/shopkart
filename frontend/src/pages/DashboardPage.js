import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../utils/axios';
import Header from '../components/Header';

const DashboardPage = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const cached = sessionStorage.getItem('shopkart_categories');
    if (cached?.length > 0) {
      setCategories(JSON.parse(cached));
    } else {
      axios.get('/product/categories')
        .then(res => {
          setCategories(res.data || []);
          sessionStorage.setItem('shopkart_categories', JSON.stringify(res.data));
        })
        .catch(err => console.error('Failed to fetch categories', err));
    }
  }, []);

  const centerNavigation = () => {
    return (
      <div className="flex gap-6 items-center text-sm font-medium text-gray-700">
        <Link to="/products" className="hover:text-black">Products</Link>

        {/* Categories Dropdown */}
        <div className="relative group">
          <button className="hover:text-black">Categories</button>
          {categories.length > 0 && (
            <div className="absolute left-0 mt-2 bg-white shadow-lg rounded-md text-sm w-48 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-2 transition-all z-10">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/products?category=${cat.id}`}
                  className="block px-4 py-2 hover:bg-neutral-100"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-100 text-gray-900">
      <Header centerNavigation={centerNavigation} />

      <main style={{
        backgroundImage: "url('/bghero.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }} className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] text-center px-6">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900 mb-4">
          Welcome to Shopkart
        </h1>
        <p className="text-gray-600 text-base md:text-lg max-w-2xl mb-8">
          Discover premium products at affordable prices. Seamless shopping experience inspired by elegance and simplicity.
        </p>
        <Link
          to="/products"
          className="bg-black text-white text-sm px-6 py-2 rounded-md hover:opacity-90 transition"
        >
          Browse Products
        </Link>
      </main>
    </div>
  );
};

export default DashboardPage;