import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import api from '../api/client';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], subtotal: 0 });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const refreshCart = useCallback(async () => {
    try {
      const { data } = await api.get('/cart');
      setCart(data.cart || { items: [], subtotal: 0 });
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshCart();
  }, [refreshCart, user]);

  const addItem = async (productId, variantId, quantity = 1) => {
    const { data } = await api.post('/cart/items', { productId, variantId, quantity });
    setCart(data.cart);
    toast.success('Added to cart');
  };

  const updateQuantity = async (itemId, quantity) => {
    const { data } = await api.put(`/cart/items/${itemId}`, { quantity });
    setCart(data.cart);
  };

  const removeItem = async (itemId) => {
    const { data } = await api.delete(`/cart/items/${itemId}`);
    setCart(data.cart);
    toast.success('Removed from cart');
  };

  const clearCart = async () => {
    await api.delete('/cart');
    setCart({ items: [], subtotal: 0 });
  };

  const itemCount = cart.items?.reduce((sum, i) => sum + i.quantity, 0) || 0;

  return (
    <CartContext.Provider value={{ cart, loading, itemCount, addItem, updateQuantity, removeItem, clearCart, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
