import React from 'react';
import { Link } from 'react-router-dom';
import { Download, FileText } from 'lucide-react';
import Header from '../components/Header';
import Table from '../components/AirTable';
import axios from '../utils/axios';
import { useToast } from '../context';

const OrderHistoryPage = () => {
  const { showSuccess, showError } = useToast();

  const handleDownloadInvoice = async (orderId) => {
    try {
      const response = await axios.get(`/orders/${orderId}/invoice`, {
        requireAuth: true,
        responseType: 'blob'
      });

      // Create a blob URL and trigger download
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-${orderId.toString().padStart(6, '0')}.pdf`;
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

  const centerNavigation = () => {
    return (
      <div className="flex gap-6 items-center text-sm font-medium text-gray-700">
        <Link to="/order/history" className="hover:text-black">Order History</Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-100 text-gray-800">
      
      <Header centerNavigation={centerNavigation} />

      <div className="max-w-4xl mx-auto py-5 px-2">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order History</h2>
          <p className="text-gray-600">View your past orders and download invoices</p>
        </div>
        
        <Table
          endpoint="/orders"
          limit={10}
          columns={[
            { header: "Order ID", accessor: "id" },
            { header: "Total Amount", accessor: "total_amount", 
              render: (value) => `₹${parseFloat(value).toFixed(2)}` },
            { header: "Status", accessor: "order_status",  
              render: (value) => (
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  value === 'delivered' ? 'bg-green-100 text-green-700' :
                  value === 'shipped' ? 'bg-blue-100 text-blue-700' :
                  value === 'processing' ? 'bg-yellow-100 text-yellow-700' :
                  value === 'cancelled' ? 'bg-red-100 text-red-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {value.charAt(0).toUpperCase() + value.slice(1)}
                </span>
              )
            },
            { header: "Order Date", accessor: "created_at",
              render: (value) => new Date(value).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })
            },
            { 
              header: "Actions", 
              accessor: "id",
              render: (orderId) => (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDownloadInvoice(orderId)}
                    className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                    title="Download Invoice"
                  >
                    <Download size={12} />
                    Invoice
                  </button>
                </div>
              )
            }
          ]}
        />
      </div>
    </div>
  );
};

export default OrderHistoryPage;