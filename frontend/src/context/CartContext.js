import React, { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';

import { jwtDecode } from 'jwt-decode' // import dependency

const CartContext = createContext();

const getUserId = () => {
  try {
    const token = Cookies.get('token');
    // Cookies.set('type', type);
    const user = jwtDecode(token);
    return user?.id || 'guestUser';
  } catch (e) {
    return 'guestUser';
  }
};

const getInitialCart = () => {
  const userId = getUserId();
  try {
    const data = localStorage.getItem(`cartItems_${userId}`);
    const guest = localStorage.getItem(`cartItems_guestUser`);
    
    if (userId !== 'guestUser' && guest) {
      const mergedCart = data ? [...JSON.parse(data), ...JSON.parse(guest)] : JSON.parse(guest);
      localStorage.removeItem(`cartItems_guestUser`);
      return mergedCart;
    }
    
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

export const CartProvider = ({ children }) => {
  const userId = getUserId();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState(getInitialCart);

  useEffect(() => {
    localStorage.setItem(`cartItems_${userId}`, JSON.stringify(cartItems));
  }, [cartItems, userId]);

  const toggleCart = () => setIsCartOpen(!isCartOpen);

  const addToCart = (item) => {
    setCartItems(prev => {
      const existingIndex = prev.findIndex(
        i => i.productId === item.productId && i.variantId === item.variantId
      );

      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex].qty += item.qty ?? 1;
        return updated;
      }

      return [...prev, { ...item, qty: item.qty ?? 1 }];
    });
  };

  const availableInCart = (productId, variantId) => {
    const existingIndex = cartItems.findIndex(
      i => i.productId === productId && i.variantId === variantId
    );
  
    return existingIndex !== -1 ? true : false;
  };

  const removeFromCart = (productId, variantId) => {
    setCartItems(prev => prev.filter(i => !(i.productId === productId && i.variantId === variantId)));
  };

  const clearCart = () => {
    localStorage.removeItem(`cartItems_${userId}`);
    setCartItems([]);
  }

  return (
    <CartContext.Provider
      value={{ cartItems, isCartOpen, toggleCart, addToCart, removeFromCart, clearCart, availableInCart}}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
