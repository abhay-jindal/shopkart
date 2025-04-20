import React, { useEffect, useState } from 'react';
import { useAuth, useCart, useToast } from '../context';
import axios from '../utils/axios';
import { LoaderCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { motion } from 'framer-motion';

const PaymentPage = () => {
    const { cartItems, clearCart } = useCart();
    const { user } = useAuth();
    const { showError } = useToast();
    const [loading, setLoading] = useState(true);
    const [addresses, setAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        if (!user) navigate('/login?referer=/checkout');
        fetchAddresses();
    }, [user]);

    const fetchAddresses = async () => {
        try {
            const res = await axios.get('/account/addresses', { requireAuth: true });
            setAddresses(res.data || []);
        } catch (error) {
            console.error("Failed to fetch addresses", error);
        } finally {
            setLoading(false);
        }
    };

    const handlePayment = async () => {
        if (!selectedAddressId) return showError("Please select an address.");

        const selectedAddress = addresses.find(addr => addr.id === selectedAddressId);
        if (!selectedAddress) return showError("Selected address not found.");

        const orderData = {
            amount: Math.round((totalAmount + 20)), // in paise
            currency: "INR"
        };

        try {
            // Create order from backend
            const razorpayOrder = await axios.post('/payment/order', orderData, { requireAuth: true });

            const options = {
                key: 'rzp_test_0DqsVb6cb8KC42',
                currency: razorpayOrder.data.currency,
                name: "ShopKart",
                description: `Order placed on ${new Date().toLocaleDateString()} for ₹${(razorpayOrder.data.amount / 100).toFixed(2)} with ${totalQty} items. Order ID: ${razorpayOrder.data.order_id}`,
                order_id: razorpayOrder.data.order_id,
                handler: async function (response) {
                    setLoading(true);
                    // Verify payment signature with backend

                    const result = await axios.post('/orders', {
                        payment_id: response.razorpay_payment_id,
                        address_id: selectedAddressId,
                        payment_order_id: response.razorpay_order_id,
                        payment_signature: response.razorpay_signature,
                        order_lines: cartItems.map(item => ({
                            variant_id: item.variantId,
                            quantity: item.qty,
                            price: item.price
                        }))
                    }, { requireAuth: true });

                    const orderData = {
                        ...result.data,
                        address: selectedAddress,
                        items: cartItems
                    }

                    clearCart();
                    setLoading(false);
                    navigate("/checkout/order/summary", { state: { order: orderData } });;
                },
                prefill: {
                    name: user?.name,
                    email: user?.sub,
                    contact: selectedAddress.phone,
                },
                theme: {
                    color: "#000000",
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            console.error('❌ Razorpay error:', err);
            showError(err?.response?.data?.detail || 'Payment failed. Please try again.');
        }
    };

    const totalAmount = cartItems.reduce((sum, i) => sum + (i.qty || 0) * (i.price || 0), 0);
    const totalQty = cartItems.reduce((sum, i) => sum + (i.qty || 0), 0);

    const centerNavigation = () => {
        return (
            <motion.div
                className="hidden md:flex items-center gap-6 ml-8 text-sm font-medium text-gray-600"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <span className="text-gray-400">Cart</span>
                <span className="w-20 h-0.5 bg-gray-300" />
                <span className="text-green-700 font-bold">Payment</span>
                <span className="w-20 h-0.5 bg-gray-300" />
                <span className="text-gray-400">Summary</span>
            </motion.div>
        )
    }

    return (
        <div className="min-h-screen bg-neutral-100 text-gray-900 ">
            <Header centerNavigation={() => centerNavigation()} showKart={false} />

            {loading && (
                <div className="fixed inset-0 bg-white bg-opacity-60 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
                    <LoaderCircle className="w-8 h-8 animate-spin text-gray-800 mb-2" />
                    <div className="text-gray-800 text-lg font-medium">Processing Payment...</div>
                </div>
            )}

            <div className="max-w-6xl mx-auto px-4 py-10 grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-2">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Select Delivery Address</h2>
                    <hr />
                    {
                        addresses.length === 0 ? (
                            <main className="flex flex-col items-center justify-center h-[calc(100vh-20rem)] text-center px-6">

                                <img src="https://cdni.iconscout.com/illustration/premium/thumb/no-address-found-illustration-download-in-svg-png-gif-file-formats--location-app-finding-permission-results-empty-state-error-pack-design-development-illustrations-3613886.png" alt="Empty Cart" className="w-32 h-32 mb-4" />
                                <p className="text-gray-600 text-base md:text-lg max-w-2xl mb-8">
                                    {/* Discover premium products at affordable prices. Seamless shopping experience inspired by elegance and simplicity. */}
                                    No addresses added. Add your delivery address to place a order!
                                </p>
                                <Link
                                    to="/addresses"
                                    className="bg-black text-white text-sm px-6 py-2 rounded-md hover:opacity-90 transition"
                                >
                                    Add Address
                                </Link>
                            </main>
                        ) :
                        (
                            <div className="space-y-2">
                                {addresses.map(addr => (
                                    <label
                                        key={addr.id}
                                        className={`block border rounded-xl p-4 cursor-pointer transition ${selectedAddressId === addr.id ? 'border-black bg-white' : 'bg-white'}`}
                                    >
                                        <input
                                            type="radio"
                                            name="address"
                                            // className="hidden"
                                            checked={selectedAddressId === addr.id}
                                            onChange={() => setSelectedAddressId(addr.id)}
                                        />
                                        <div className="text-sm text-gray-700">
                                            <p className="font-semibold text-base">{addr.alias}</p>
                                            <p>{addr.address_line1}, {addr.city}, {addr.state} - {addr.zip_code}</p>
                                        </div>
                                    </label>
                                ))}
                            </div>

                        )
                    }
                </div>

                <div className="text-sm text-gray-700 space-y-4 bg-white p-4 rounded-xl shadow-sm">
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span>Total MRP</span>
                            <span className="text-gray-900 font-medium">₹{totalAmount + 0}</span>
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
                        onClick={handlePayment}
                        className="w-full mt-4 bg-black text-white font-semibold py-3 rounded-lg hover:opacity-95 transition"
                    >
                        PAY NOW
                    </button>

                    <div className="max-w-6xl mx-auto px-4 py-6 text-sm text-gray-700">
                        <div className="flex flex-col md:flex-row justify-between items-center">
                            <div className="flex items-center flex-wrap justify-center gap-3">
                                <img src="https://img.icons8.com/color/48/000000/lock--v1.png" alt="Secure" className="h-6" />
                                <img src="https://img.icons8.com/color/48/000000/visa.png" alt="Visa" className="h-6" />
                                <img src="https://img.icons8.com/color/48/000000/mastercard.png" alt="MasterCard" className="h-6" />
                                <img src="https://img.icons8.com/color/48/000000/amex.png" alt="Amex" className="h-6" />
                                <img src="https://img.icons8.com/color/48/000000/discover.png" alt="Discover" className="h-6" />
                                <img src="https://img.icons8.com/color/48/000000/rupay.png" alt="RuPay" className="h-6" />
                                <img src="https://img.icons8.com/color/48/000000/paypal.png" alt="PayPal" className="h-6" />
                                <img src="https://img.icons8.com/color/48/000000/bhim.png" alt="BHIM" className="h-6" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;
