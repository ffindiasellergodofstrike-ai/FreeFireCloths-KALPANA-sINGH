import { isRetiredProduct } from '../data/retired-products';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

export interface CartItem {
  key: string;
  id: number;
  name: string;
  price: number;
  cat: 'men' | 'women' | 'kids' | 'electronics' | 'accessories';
  size: string;
  color?: string;
  qty: number;
  image?: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: any, size?: string, qty?: number, color?: string, customImage?: string) => void;
  updateQty: (key: string, delta: number) => void;
  removeFromCart: (key: string) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  cartCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('gs_cart_v2');
      return saved ? JSON.parse(saved).filter((item: CartItem) => !isRetiredProduct(item.id)) : [];
    } catch (e) {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('gs_cart_v2', JSON.stringify(cart));
    } catch (e) {}
  }, [cart]);

  const addToCart = (product: any, size?: string, qty: number = 1, color?: string, customImage?: string) => {
    if (isRetiredProduct(product.id)) return;
    const selectedSize = size || (product.sizes && product.sizes[0]) || 'ONE SIZE';
    const selectedColor = color || '';
    const itemKey = `${product.id}-${selectedSize}-${selectedColor}`;

    const chosenImage = customImage || (product.images && product.images.length > 0 ? product.images[0] : undefined);

    setCart(prev => {
      const existing = prev.find(item => item.key === itemKey);
      if (existing) {
        return prev.map(item => 
          item.key === itemKey 
            ? { ...item, qty: item.qty + qty } 
            : item
        );
      }
      return [...prev, { 
        key: itemKey,
        id: product.id, 
        name: selectedColor ? `${product.name} (${selectedColor})` : product.name, 
        price: product.price, 
        cat: product.cat,
        size: selectedSize, 
        color: selectedColor,
        qty: qty,
        image: chosenImage
      }];
    });

    toast.success(`"${product.name}" added to bag!`);
  };

  const updateQty = (key: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.key === key) {
        const newQty = Math.max(1, item.qty + delta);
        return { ...item, qty: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (key: string) => {
    setCart(prev => prev.filter(item => item.key !== key));
    toast.info('Removed from bag');
  };

  const clearCart = () => setCart([]);

  const getTotalPrice = () => cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      updateQty, 
      removeFromCart, 
      clearCart, 
      getTotalPrice, 
      cartCount,
      isCartOpen,
      setIsCartOpen
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
