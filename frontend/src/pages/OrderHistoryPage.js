import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Table from '../components/AirTable';

const OrderHistoryPage = () => {

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
      <Table
        endpoint="/orders"
        limit={10}
        columns={[
          { header: "Order ID", accessor: "id" },
          { header: "Total Amount", accessor: "total_amount" },
          { header: "Status", accessor: "order_status",  render: (value) => <span className="bg-blue-100 text-blue-700 hover:bg-blue-200 px-2 py-1 rounded text-xs">{value}</span>  },
          { header: "Order Date", accessor: "created_at", },
        ]}
      />
      </div>
    </div>
  );
};

export default OrderHistoryPage;