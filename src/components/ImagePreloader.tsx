import { isRetiredProduct } from '../data/retired-products';
import { useEffect } from 'react';
import { PRODUCTS } from '../data/products';

export default function ImagePreloader() {
  useEffect(() => {
    // Delay preloading slightly to prioritize critical rendering path
    const timer = setTimeout(() => {
      const imageUrls = new Set<string>();
      
      // Collect all images from the default products
      PRODUCTS.filter(product => product.featured).slice(0, 4).forEach(product => {
        if (product.images && product.images.length > 0) {
          product.images.slice(0, 1).forEach(img => {
            if (img) imageUrls.add(img);
          });
        }
      });
      
      // Collect all images from custom products in localStorage
      try {
        const saved = localStorage.getItem('garena_custom_products');
        if (saved) {
          const customProducts = JSON.parse(saved);
          if (Array.isArray(customProducts)) {
            customProducts.filter(product => !isRetiredProduct(product.id)).slice(0, 4).forEach(product => {
              if (product.images && product.images.length > 0) {
                product.images.slice(0, 1).forEach((img: string) => {
                  if (img) imageUrls.add(img);
                });
              }
            });
          }
        }
      } catch (e) {
        // Silently handle JSON parse errors
      }
      
      // Preload images by creating Image objects
      // Browsers will cache these resources, making them instantly available later
      Array.from(imageUrls).forEach(url => {
        const img = new Image();
        // Use no-referrer to match how we fetch them elsewhere
        img.referrerPolicy = "no-referrer"; 
        img.src = url;
      });
      
    }, 2000); // Wait 2 seconds after initial mount
    
    return () => clearTimeout(timer);
  }, []);
  
  return null;
}
