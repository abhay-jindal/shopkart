import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import axios from "../utils/axios";

const Table = ({ columns, endpoint, limit = 10 }) => {
  const [data, setData] = useState([]);
  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
    const res = await axios.get(endpoint, {
      params: { limit, offset }, requireAuth: true 
    });
      setData(res.data.orders);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.error("Error fetching table data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalPages = Math.ceil(total / limit);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full overflow-x-auto rounded-xl border border-gray-200 bg-white"
    >
      <table className="min-w-full table-fixed text-sm" style={{ minHeight: "400px" }}>
        <thead className="bg-gray-200">
          <tr>
            {columns.map((col, idx) => (
              <th
                key={idx}
                className="px-3 py-2 text-left text-xs font-semibold text-gray-500 uppercase border-b border-gray-200"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-gray-700">
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-6 text-center text-gray-400">
                Loading...
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-6 text-center text-gray-400">
                No data found.
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr
                key={idx}
                className={
                  idx % 2 === 0
                    ? "bg-white hover:bg-neutral-50 transition-all"
                    : "bg-gray-50 hover:bg-neutral-100 transition-all"
                }
              >
                {columns.map((col, cidx) => (
                  <td key={cidx} className="px-3 py-2 whitespace-nowrap text-xs">
                    {col.render ? col.render(row[col.accessor], row) : row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-t border-gray-200 text-xs">
        <div className="text-gray-500">
          Showing {offset + 1} to {Math.min(offset + limit, total)} of {total} results
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setOffset((prev) => Math.max(prev - limit, 0))}
            disabled={offset === 0}
            className="p-1 rounded-full border border-gray-300 hover:bg-gray-100 disabled:opacity-30"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => setOffset((prev) => Math.min(prev + limit, (totalPages - 1) * limit))}
            disabled={offset + limit >= total}
            className="p-1 rounded-full border border-gray-300 hover:bg-gray-100 disabled:opacity-30"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Table;
