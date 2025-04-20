import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LoaderCircle } from 'lucide-react';
import { motion } from "framer-motion";
import Header from '../components/Header';
import { useAuth, useCart } from '../context';
import axios from '../utils/axios';


const CartPage = () => {
    const { cartItems, addToCart, removeFromCart } = useCart();
    const { user } = useAuth();
    const [outOfStockItems, setOutOfStockItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);

    useEffect(() => {
        validateStock();
    }, []);

    const validateStock = async () => {
        setLoading(true);

        try {
            if (cartItems.length === 0) {
                setLoading(false);
                return;
            }
            const res = await axios.post(`/product/variants`, { ids: cartItems.map(i => i.variantId) });
            if (res.status !== 200) {
                throw new Error('Failed to fetch product data');
            }

            const backendStockData = res.data; // Assuming backend returns an array of objects with variantId and stock
            const outOfStock = cartItems.filter(item => {
                const backendItem = backendStockData.find(backend => backend.id === item.variantId);
                return !backendItem || backendItem.stock < item.qty;
            }).map(item => item.variantId);

            setOutOfStockItems(outOfStock);
        } catch (err) {
            console.error("Failed to fetch product stock data", err);
        }

        setLoading(false);
    };

    const increaseQty = (item) => {
        addToCart({ ...item, qty: 1 });
    };

    const decreaseQty = (item) => {
        if (item.qty > 1) {
            addToCart({ ...item, qty: -1 });
        } else {
            removeFromCart(item.productId, item.variantId);
        }
    };

    const handlePlaceOrder = async () => {

        // Example: Check if user is signed in
        if (!user) {
            setLoading(false);
            navigate('/login?referer=/checkout/payment');
            return;
        }

        setLoading(true);
        await validateStock();
        if (outOfStockItems.length > 0) {
            // showError('Some items are out of stock. Please remove them to proceed.');
            setLoading(false);
            return;
        }
        setLoading(false);
        navigate('/checkout/payment');
    };

    const confirmAddToCart = () => {
        if (selectedProduct && selectedSize) {
            addToCart({
                productId: selectedProduct.id,
                variantId: selectedProduct.id + '_' + selectedSize,
                qty: 1,
                price: selectedProduct.price,
                name: selectedProduct.name,
                image_url: selectedProduct.image_url,
                size: selectedSize,
                color: 'N/A',
            });
            setShowModal(false);
            setSelectedSize(null);
        }
    };

    const handleAddSuggested = (product) => {
        setSelectedProduct(product);
        setShowModal(true);
    };

    const totalAmount = cartItems.reduce((sum, i) => sum + (i.isOutOfStock ? 0 : (i.qty || 0) * (i.price || 0)), 0);

    const centerNavigation = () => {
        return (
            <motion.div
                className="hidden md:flex items-center gap-6 ml-8 text-sm font-medium text-gray-600"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <span className="text-green-700 font-bold cursor-pointer">Cart</span>
                <span className="w-20 h-0.5 bg-gray-300" />
                <span className="text-gray-400">Payment</span>
                <span className="w-20 h-0.5 bg-gray-300" />
                <span className="text-gray-400">Summary</span>
            </motion.div>
        )
    }

    return (
        <div className="relative min-h-screen bg-neutral-100 text-gray-900">

            <Header centerNavigation={() => centerNavigation()} showKart={false} />

            {loading && (
                <div className="fixed inset-0 bg-white bg-opacity-60 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
                    <LoaderCircle className="w-8 h-8 animate-spin text-gray-800 mb-2" />
                    <div className="text-gray-800 text-lg font-medium">Loading your cart...</div>
                </div>
            )}

            <div className="max-w-6xl mx-auto px-4 py-10">
                {cartItems.length === 0 ? (
                    <main className="flex flex-col items-center justify-center h-[calc(100vh-10rem)] text-center px-6">

                        <img src="https://cdn-icons-png.flaticon.com/128/11329/11329060.png" alt="Empty Cart" className="w-32 h-32 mb-4" />
                        <p className="text-gray-600 text-base md:text-lg max-w-2xl mb-8">
                            {/* Discover premium products at affordable prices. Seamless shopping experience inspired by elegance and simplicity. */}
                            There is nothing in your cart. Add some products to your cart to proceed!
                        </p>
                        <Link
                            to="/products"
                            className="bg-black text-white text-sm px-6 py-2 rounded-md hover:opacity-90 transition"
                        >
                            Add Products
                        </Link>
                    </main>
                ) : (
                    <div className="grid lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-2">
                            {outOfStockItems.length > 0 && <motion.div
                                className="flex items-center bg-red-100 text-red-700 p-2 rounded-lg mb-4"
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.5 }}
                            >
                                <span className="mr-2">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="w-5 h-5 text-red-700"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        aria-hidden="true"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM9 5a1 1 0 112 0v4a1 1 0 11-2 0V5zm0 6a1 1 0 112 0v2a1 1 0 11-2 0v-2z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </span>
                                <span className="font-semibold">Some items are out of stock. Please remove them.</span>
                            </motion.div>}
                            {cartItems.map((item) => (
                                <div
                                    key={`${item.productId}_${item.variantId}`}
                                    className={`flex items-center justify-between border bg-white rounded-2xl p-4 transition ${outOfStockItems.includes(item.variantId) ? 'border-red-500 bg-red-50' : ''}`}
                                // className="flex items-center justify-between border bg-white rounded-2xl p-4 transition"
                                >
                                    <img
                                        src={item.image_url}
                                        alt={item.name}
                                        className="w-24 h-24 object-cover rounded-xl"
                                    />
                                    <div className="flex-1 ml-4 space-y-1">
                                        <h2 className="font-semibold text-lg text-gray-900 leading-tight">{item.name}</h2>
                                        <p className="text-sm text-gray-500">Variant: {item.size} {item.color}</p>
                                        <p className="text-sm text-gray-400">Price: ₹ {parseInt(item.price)}</p>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => decreaseQty(item)}
                                            className="text-lg px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 transition"
                                        >-</button>
                                        <span className="min-w-[20px] text-center text-gray-800">{item.qty}</span>
                                        <button
                                            onClick={() => increaseQty(item)}
                                            className="text-lg px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 transition"
                                        >+</button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="text-sm text-gray-700 space-y-4 bg-white p-4 rounded-xl shadow-sm">
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className='font-semibold mb-2'>{`Price Details (${cartItems.length} items)`}</span>
                                    {/* <span className="text-gray-900 font-small">₹{parseFloat(totalAmount, 2)}</span> */}
                                </div>
                                <div className="flex justify-between">
                                    <span>Total MRP</span>
                                    <span className="text-gray-900 font-medium">₹{parseFloat(totalAmount, 2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Discount on MRP <span className="text-pink-500 cursor-pointer">Know More</span></span>
                                    <span className="text-green-600">- ₹0</span>
                                </div>

                                <div className="flex justify-between">
                                    <span>Platform Fee <span className="text-pink-500 cursor-pointer">Know More</span></span>
                                    <span>₹20</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>
                                        Shipping Fee <span className="text-pink-500 cursor-pointer">Know More</span><br />
                                        <span className="text-xs text-gray-400">Free shipping for you</span>
                                    </span>
                                    <span className="text-green-600">FREE</span>
                                </div>
                            </div>
                            <hr />
                            <div className="flex justify-between text-base font-semibold text-gray-900">
                                <span>Total Amount</span>
                                <span>₹{totalAmount + 20}</span>
                            </div>
                            <button
                                onClick={handlePlaceOrder}
                                className="w-full mt-4 bg-black text-white font-semibold py-3 rounded-lg hover:opacity-95 transition"
                            >
                                PLACE ORDER
                            </button>
                        </div>
                    </div>
                )}

                {/* Suggested Products */}
                <div className="mt-12 bg-white border border-neutral-200 rounded-2xl  px-6 py-8">
                    <h2 className="text-xl font-semibold mb-4 text-gray-900">You might also like</h2>
                    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                        {cartItems.map((prod) => (
                            <div key={prod.id} className="min-w-[200px] p-4 bg-neutral-50 rounded-xl shadow-sm border border-gray-100">
                                <img src={prod.image_url} alt={prod.name} className="h-36 w-full object-cover rounded-lg mb-2" />
                                <h3 className="font-medium text-gray-800 text-sm mb-1">{prod.name}</h3>
                                <p className="text-gray-600 text-sm">₹{prod.price}</p>
                                <button
                                    className="mt-2 w-full bg-black text-white text-sm py-1.5 rounded hover:opacity-90"
                                    onClick={() => handleAddSuggested(prod)}
                                >
                                    Add to Cart
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Modal for choosing size */}
                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-xl w-80 space-y-4">
                            <h3 className="text-lg font-semibold">Select Size</h3>
                            <div className="flex gap-2">
                                {["S", "M", "L", "XL"].map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`px-3 py-1 border rounded-full ${selectedSize === size ? 'bg-black text-white' : 'bg-white text-black'}`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <button onClick={() => setShowModal(false)} className="text-sm">Cancel</button>
                                <button
                                    onClick={confirmAddToCart}
                                    className="bg-black text-white px-4 py-1.5 rounded text-sm"
                                    disabled={!selectedSize}
                                >
                                    Add
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartPage;
