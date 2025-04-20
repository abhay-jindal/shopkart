import React, { useEffect, useState, useCallback } from 'react';
import axios from '../utils/axios';
import debounce from 'lodash.debounce';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";
import PriceRangeSlider from '../components/Slider';
import Header from '../components/Header';

const LIMIT = 12;

const ProductPage = () => {
    const [products, setProducts] = useState([]);
    const [offset, setOffset] = useState(0);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [isInitialLoading, setIsInitialLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [priceRange, setPriceRange] = useState({ min: 100, max: 8000 });

    const [searchParams] = useSearchParams();
    const [category, setCategory] = useState(searchParams.get('category') || '');
    const [categories, setCategories] = useState([]);

    const fetchCategories = async () => {
        const cached = sessionStorage.getItem('shopkart_categories');
        if (cached?.length > 0) {
            setCategories(JSON.parse(cached));
        } else {
            try {
                const res = await axios.get('/product/categories');
                setCategories(res.data || []);
                sessionStorage.setItem('shopkart_categories', JSON.stringify(res.data));
            } catch (err) {
                console.error('Failed to fetch categories', err);
            }
        }
    };

    const fetchProducts = async (reset = false) => {
        if (loading) return;
        setLoading(true);

        try {
            const res = await axios.get('/products', {
                params: {
                    offset: reset ? 0 : parseInt(offset, 10),
                    limit: LIMIT,
                    search: searchTerm,
                    min_price: parseFloat(priceRange.min, 10) || undefined,
                    max_price: parseFloat(priceRange.max, 10) || undefined,
                    category_id: parseInt(category, 10) || undefined,
                },
            });
            const newProducts = res.data || [];
            setProducts(prev => (reset ? newProducts : [...prev, ...newProducts]));
            setOffset(prev => (reset ? LIMIT : prev + LIMIT));
            setHasMore(newProducts.length === LIMIT);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
            setIsInitialLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
        fetchProducts(true);
    }, []);

    const fetchSuggestions = useCallback(
        debounce(async (term) => {
            if (term.length > 0) {
                setIsLoading(true);
                setShowSuggestions(true);
                try {
                    const response = await axios.get('/products/suggestion', {
                        params: { naming: term, limit: 10 },
                    });
                    setSuggestions(response.data);
                } catch (err) {
                    console.error('Error fetching suggestions:', err);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setSuggestions([]);
            }
        }, 600),
        []
    );

    useEffect(() => {
        fetchSuggestions(searchTerm);
    }, [searchTerm, fetchSuggestions]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const renderSkeletons = () =>
        Array.from({ length: 8 }).map((_, idx) => (
            <div key={idx} className="bg-white shadow p-4 animate-pulse">
                <div className="h-48 bg-gray-200 mb-4" />
                <div className="h-4 bg-gray-200 w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 w-1/2 mb-2" />
                <div className="h-4 bg-gray-200 w-1/3" />
            </div>
        ));

    const centerNavigation = () => {
        return (
            <div className="flex gap-6 items-center text-sm font-medium text-gray-700">
                <Link to="/products" className="hover:text-black">Product Catalog</Link>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-neutral-100 text-gray-800">
            <Header centerNavigation={centerNavigation} />

            <div className="max-w-7xl mx-auto my-2 relative z-10">
                {/* Filters */}
                <div className="top-0 sticky z-20 bg-white/90 backdrop-blur-md border border-gray-200 rounded-xl px-2 py-2 mb-6">
                    <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 relative">
                        <div className="relative w-80">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={handleSearchChange}
                                className="border border-gray-300 rounded-md text-sm px-3 py-1 h-9 w-full focus:outline-none focus:ring-1 focus:ring-black transition"
                                placeholder="Search for names..."
                            />
                            {showSuggestions && searchTerm?.length > 0 && (
                                <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-gray-300 rounded-md shadow-lg z-50">
                                    {isLoading ? (
                                        <div className="p-2 text-center text-sm text-gray-500">Loading...</div>
                                    ) : (
                                        suggestions.map((name, index) => (
                                            <div
                                                key={index}
                                                onClick={() => {
                                                    setSearchTerm(name);
                                                    setShowSuggestions(false);
                                                }}
                                                className="p-2 hover:bg-gray-100 cursor-pointer text-gray-500"
                                            >
                                                {name}
                                            </div>
                                        ))
                                    )}
                                    {suggestions.length === 0 && !isLoading && (
                                        <div className="p-2 text-center text-sm text-gray-500">No suggestions</div>
                                    )}
                                </div>
                            )}
                        </div>

                        <PriceRangeSlider priceRange={priceRange} setPriceRange={setPriceRange} />

                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="border border-gray-300 rounded-md text-sm px-3 h-10 w-full md:w-48 text-gray-700 focus:outline-none focus:ring-1 focus:ring-black transition"
                        >
                            <option value="">All Categories</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>

                        <div className="flex gap-2 mt-2 md:mt-0">
                            <button
                                onClick={() => {
                                    fetchProducts(true);
                                    setShowSuggestions(false);
                                }}
                                className="bg-black text-white text-xs px-4 h-9 rounded-md hover:bg-gray-900 transition"
                            >
                                Apply
                            </button>
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setPriceRange({ min: '', max: '' });
                                    setCategory('');
                                    fetchProducts(true);
                                    setShowSuggestions(false);
                                }}
                                className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 h-9 rounded-md border border-gray-300 transition"
                            >
                                Clear
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {isInitialLoading
                        ? renderSkeletons()
                        : products.map((product) => (
                            <div
                                key={product.id}
                                onClick={() => window.open(`/product/${product.id}`, '_blank')}
                                className="hover:bg-beige-800 px-3 py-1 rounded text-xs font-medium transition duration-200 cursor-pointer"
                            >
                                <div className="overflow-hidden mb-4">
                                    <AnimatePresence mode="wait">
                                        <motion.img
                                            key={product.image_url}
                                            src={product.image_url}
                                            alt={product.name}
                                            className="w-full h-[300px] object-cover rounded-xl"
                                            initial={{ opacity: 0, scale: 0.98 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.98 }}
                                            transition={{ duration: 0.3 }}
                                        />
                                    </AnimatePresence>
                                </div>
                                <h3 className="text-base font-medium text-gray-800 line-clamp-1">{product.name}</h3>
                                <p className="text-gray-500 text-sm line-clamp-2 mb-1">{product.description}</p>
                                <span className="text-lg font-semibold text-black mb-2">Rs. {product.price}</span>
                            </div>
                        ))}
                </div>

                {!isInitialLoading && hasMore && (
                    <div className="text-center py-10">
                        <button
                            onClick={() => fetchProducts()}
                            className="bg-black text-white hover:bg-gray-800 px-3 py-1 rounded text-xs font-medium transition duration-200"
                            disabled={loading}
                        >
                            {loading ? 'Loading...' : 'Load More'}
                        </button>
                    </div>
                )}
                {!hasMore && products.length > 0 && (
                    <p className="text-center py-10 text-gray-400 text-sm">No more products</p>
                )}
                {!hasMore && products.length === 0 && (
                    <main className="flex flex-col items-center justify-center h-[calc(100vh-10rem)] text-center px-6">

                        <img src="https://virota.com/images/search/no-product-500x500.png" alt="Empty Cart" className="w-32 h-32 mb-4" />
                        <p className="text-gray-600 text-base md:text-lg max-w-2xl mb-8">
                            Your search did not match any products. Please try again!
                        </p>
                    </main>
                )}
            </div>
        </div>
    );
};

export default ProductPage;