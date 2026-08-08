import React, { createContext, useContext, useState, useEffect } from 'react';
import { PRODUCTS, Product } from '../data/products';

interface ProductContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'rating' | 'reviews'> & { rating?: number; reviews?: number }) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Load custom products from localStorage
    const saved = localStorage.getItem('garena_custom_products');
    let customProducts: Product[] = [];
    if (saved) {
      try {
        customProducts = JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing custom products', e);
      }
    }
    setProducts([...PRODUCTS, ...customProducts]);
  }, []);

  const addProduct = (newProductData: Omit<Product, 'id' | 'rating' | 'reviews'> & { rating?: number; reviews?: number }) => {
    // Calculate new id
    const maxId = products.length > 0 ? Math.max(...products.map(p => p.id)) : 100;
    const newId = Math.max(maxId + 1, 200); // Dynamic products start above 200

    const newProduct: Product = {
      ...newProductData,
      id: newId,
      rating: newProductData.rating ?? 4.8,
      reviews: newProductData.reviews ?? 1,
      badge: 'NEW', // Newly added product automatically appears in New Arrivals
    };

    const updated = [...products, newProduct];
    setProducts(updated);

    // Save custom products (only those >= 200) to localStorage
    const customOnly = updated.filter(p => p.id >= 200);
    localStorage.setItem('garena_custom_products', JSON.stringify(customOnly));
  };

  return (
    <ProductContext.Provider value={{ products, addProduct }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
}
