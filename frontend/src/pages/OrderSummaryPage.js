import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { CheckCircle, Download } from "lucide-react";
import { motion } from "framer-motion";
import Header from "../components/Header";
import axios from "../utils/axios";
import { useToast } from "../context";

const OrderSummaryPage = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { showSuccess, showError } = useToast();

    useEffect(() => {
        if (!state?.order) {
            navigate("/"); // fallback if opened directly
        }
    }, [state, navigate]);

    const handleDownloadInvoice = async () => {
        try {
            const response = await axios.get(`/orders/${order.id}/invoice`, {
                requireAuth: true,
                responseType: 'blob'
            });

            // Create a blob URL and trigger download
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `invoice-${order.id.toString().padStart(6, '0')}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            showSuccess('Invoice downloaded successfully!');
        } catch (error) {
            console.error('Error downloading invoice:', error);
            showError('Failed to download invoice. Please try again.');
        }
    };

    if (!state?.order) return null;

    const order = state.order;

    const centerNavigation = () => {
        return (
            <motion.div
                className="hidden md:flex items-center gap-6 ml-8 text-sm font-medium text-gray-600"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <span className="text-gray-400 cursor-pointer">Cart</span>
                <span className="w-20 h-0.5 bg-gray-300" />
                <span className="text-gray-400">Payment</span>
                <span className="w-20 h-0.5 bg-gray-300" />
                <span className="text-green-700 font-bold">Summary</span>
            </motion.div>
        )
    }

    return (
        <div className="relative min-h-screen bg-neutral-100 text-gray-900">
            <Header centerNavigation={() => centerNavigation()} showKart={false} />

            <motion.div
                className="max-w-4xl mx-auto px-4 py-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="flex flex-col items-center text-center mb-6">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 120 }}
                    >
                        <CheckCircle className="text-green-500 w-20 h-20 mb-3" />
                    </motion.div>
                    <h1 className="text-2xl font-semibold mb-1">Order Confirmed</h1>
                    <p className="text-sm text-gray-500">
                        Order <span className="font-medium text-gray-800">#{order.id}</span> placed successfully. An Confirmation email has been sent!
                    </p>
                    
                    {/* Download Invoice Button */}
                    <motion.button
                        onClick={handleDownloadInvoice}
                        className="mt-4 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Download size={16} />
                        Download Invoice
                    </motion.button>
                </div>

                <div className="bg-white rounded-2xl  p-5 space-y-6 text-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                        <div className="space-y-2">
                            <h2 className="text-base font-semibold text-gray-800">Order Summary</h2>
                            <div className="space-y-1 text-gray-700">
                                <div className="flex justify-between">
                                    <span>Order ID</span>
                                    <span>#{order.id}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Total</span>
                                    <span className="font-semibold text-gray-900">₹{order.total_amount}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Payment</span>
                                    <span>{order.payment_mode || "UPI"}</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2 md:border-l md:pl-6 border-gray-200">
                            <h2 className="text-base font-semibold text-gray-800">Shipping Address</h2>
                            <p className="text-gray-700 leading-relaxed">
                                {order.address?.alias}<br />
                                {order.address?.address_line1}, {order.address?.city},<br />
                                {order.address?.state} - {order.address?.zip_code}
                            </p>
                        </div>
                    </div>

                    <div className="border-t border-gray-200" />

                    {/* Items Ordered */}
                    <div>
                        <h2 className="text-base font-semibold text-gray-800 mb-3">Items Ordered</h2>
                        <ul className="divide-y divide-gray-100">
                            {order.items.map((item) => (
                                <li key={item.id} className="py-3 flex items-center gap-4">
                                    <img
                                        src={item.image_url}
                                        alt={item.name}
                                        className="w-16 h-16 object-cover rounded-lg"
                                    />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-900">{item.name}</p>
                                        <p className="text-xs text-gray-500">
                                            Size: {item.size}, Color: {item.color} | Qty: {item.qty}
                                        </p>
                                    </div>
                                    <p className="text-sm font-semibold text-gray-800">₹{item.price}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default OrderSummaryPage;
