import { useState, useEffect } from 'react';
import { createCart, findCartById, updateCart } from '../api/cartService';

export const useCart = (userId, frete) => {
  const [cartId, setCartId] = useState(localStorage.getItem('carrinhoId'));
  const [cart, setCart] = useState([]);

  useEffect(() => {
    if (cartId) {
      const fetchCart = async () => {
        try {
          const response = await findCartById(cartId);
          setCart(response.data.produtos || []);
        } catch (error) {
          console.error('Erro ao buscar carrinho:', error);
        }
      };
      fetchCart();
    }
  }, [cartId]);
  
  const addToCart = async (product, quantity) => {
    try {
      const updatedCart = [...cart];
      const existingProductIndex = updatedCart.findIndex((item) => item._id === product._id);
  
      if (existingProductIndex > -1) {
        updatedCart[existingProductIndex].quantidade += quantity;
      } else {
        updatedCart.push({ ...product, quantidade: quantity });
      }
  
      // Corrigindo o cálculo do preço total
      const precoProdutos = updatedCart.reduce((acc, item) => acc + item.precoUnitario * item.quantidade, 0);
      const precoTotal = precoProdutos + frete;  // Adicionando o frete
  
      const cartData = {
        produtos: updatedCart.map((item) => ({ _id: item._id, quantidade: item.quantidade })),
        frete,
        precoTotal,
        userId,
      };
  
      if (cartId) {
        await updateCart(cartId, cartData);
      } else {
        const response = await createCart(cartData);
        const newCartId = response.data._id;
        setCartId(newCartId);
        localStorage.setItem('carrinhoId', newCartId);
      }
  
      setCart(updatedCart);
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error);
      throw error;
    }
  };
  

  return { cart, addToCart };
};
