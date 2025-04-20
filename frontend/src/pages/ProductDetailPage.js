import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../utils/axios";
import { useCart, useToast } from "../context";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../components/Header";
import { LoaderCircle } from "lucide-react";


const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart, availableInCart } = useCart();
  const [product, setProduct] = useState(null);
  const [variants, setVariants] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);

  const { showSuccess } = useToast();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`/products/${id}`);
        setProduct(res.data);
        setVariants(res.data.variants || []);
        setSelectedVariant(res.data.variants?.[0] || null);
      } catch (err) {
        console.error("Failed to fetch product", err);
      }
    };

    fetchProduct();
  }, [id]);

  const uniqueSizes = [...new Set(variants.map(v => v.size))];

  const handleSizeSelect = (size) => {
    const matchedVariant = variants.find(v => v.size === size);
    if (matchedVariant) {
      setSelectedVariant(matchedVariant);
    }
  };

  const centerNavigation = () => {
    return null;
  };

  if (!product || !selectedVariant) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-60 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
        <LoaderCircle className="w-8 h-8 animate-spin text-gray-800 mb-2" />
        <div className="text-gray-800 text-lg font-medium">Loading Product...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-100 text-gray-900">
      <Header centerNavigation={centerNavigation} />
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Image */}
        <div className="overflow-hidden rounded-xl">
          <AnimatePresence mode="wait">
            <motion.img
              key={product.image_url}
              src={product.image_url}
              alt={product.name}
              className="w-full h-[500px] object-cover rounded-xl"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
            />
          </AnimatePresence>
        </div>

        <div className="flex-1 space-y-6">
          <h1 className="text-2xl font-semibold text-gray-900">{product.name}</h1>

          <p className="text-xl font-bold text-black">Rs. {parseInt(selectedVariant.price)}</p>

          <p className={`text-sm font-medium ${selectedVariant.stock ? 'text-green-600' : 'text-red-500'}`}>
            {selectedVariant.stock ? 'In Stock' : 'Out of Stock'}
          </p>

          {/* Ratings */}
          <div className="flex items-center gap-2 text-sm text-yellow-500">
            <span>★★★★☆</span>
            <span className="text-gray-500">(112 reviews)</span>
          </div>

          {/* Variant Options */}
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600 mb-1">Select Size:</p>
              <div className="flex gap-2">
                {uniqueSizes.map(size => (
                  <button
                    key={size}
                    onClick={() => handleSizeSelect(size)}
                    className={`px-3 py-1 border rounded-md text-sm font-medium transition ${selectedVariant.size === size ? 'bg-black text-white border-black' : 'bg-white border-gray-300 hover:bg-gray-100'
                      }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="text-sm text-gray-700 leading-relaxed">
            <p>
              Made from premium organic cotton, this T-shirt offers ultimate comfort and a minimal aesthetic. Perfect for everyday
              wear or layering under jackets.
            </p>
            <ul className="list-disc list-inside mt-3 text-gray-600 space-y-1">
              <li>100% Organic Cotton</li>
              <li>Pre-shrunk & bio-washed</li>
              <li>Minimal embroidered design</li>
              <li>Designed and made in India</li>
            </ul>
          </div>

          {/* Add to Cart Button */}
          <button
            disabled={selectedVariant.stock === 0}
            onClick={() => {
              if (!availableInCart(product.id, selectedVariant.id)) {
                addToCart({
                  productId: product.id,
                  variantId: selectedVariant.id,
                  size: selectedVariant.size,
                  qty: 1,
                  image_url: product.image_url,
                  color: selectedVariant.color,
                  name: product.name,
                  price: selectedVariant.price,
                });

                showSuccess('Added to cart!');
              }
            }}
            className={`w-full cursor-pointer py-3 rounded-lg text-sm font-medium transition ${selectedVariant.stock ? 'bg-black text-white hover:bg-gray-800' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
          >
            {availableInCart(product.id, selectedVariant.id) ? `Go to Cart` : selectedVariant.stock ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;