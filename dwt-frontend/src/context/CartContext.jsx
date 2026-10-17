import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('dwt_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('dwt_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, size = 'M', qty = 1) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.product === product._id && item.size === size);
      if (existing) {
        return prev.map(item =>
          item.product === product._id && item.size === size
            ? { ...item, qty: item.qty + qty }
            : item
        );
      }
      return [
        ...prev,
        {
          product: product._id,
          name: product.name,
          price: product.price,
          image: product.images?.[0] || '',
          size,
          qty
        }
      ];
    });
  };

  const removeFromCart = (productId, size) => {
    setCartItems(prev => prev.filter(item => !(item.product === productId && item.size === size)));
  };

  const clearCart = () => setCartItems([]);

  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shippingPrice = itemsPrice >= 150 || itemsPrice === 0 ? 0 : 7; // Gratuit dès 150 DT ou 7 DT
  const totalPrice = itemsPrice + shippingPrice;

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, totalItems, itemsPrice, shippingPrice, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
