import { useState, useEffect } from 'react';
import { findProductById } from '../api/productService';

export const useProduct = (productId) => {
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await findProductById(productId);
        setProduct(response.data);
      } catch (error) {
        console.error('Erro ao buscar produto:', error);
      }
    };
    fetchProduct();
  }, [productId]);

  return product;
};
