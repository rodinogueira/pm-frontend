import React, { useEffect, useState } from 'react';
import { findCartById } from '../../api/cartService';
import { useNavigate } from 'react-router-dom';

const MyCart = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  console.log(cart, 'myccart')
  // Recuperar o carrinhoId do localStorage
  const cartId = localStorage.getItem('carrinhoId');

  useEffect(() => {
    const fetchCart = async () => {
      if (!cartId) {
        console.error('Carrinho ID não encontrado.');
        return;
      }

      try {
        const response = await findCartById(cartId);
        setCart(response.data);
      } catch (error) {
        console.error('Erro ao buscar carrinho:', error);
      }
    };

    // Chama a função para buscar os dados do carrinho
    fetchCart();
  }, [cartId]); // O useEffect agora depende do cartId

  if (!cart) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Carregando carrinho...</p>
      </div>
    );
  }

  return (
    <div className="max-w-screen-lg mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Meu Carrinho</h1>

      {cart.produtos.length === 0 ? (
        <p>Seu carrinho está vazio.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {cart.produtos.map((product) => (
            <div
              key={product._id}
              className="p-4 border rounded-lg shadow hover:shadow-lg transition"
            >
              <img
                src={product.imagem || 'https://via.placeholder.com/150'}
                alt={product.nome}
                className="w-full h-32 object-cover rounded mb-2"
              />
              <p className="text-sm text-gray-600">
                Quantidade: {product.quantidade}
              </p>
            </div>
          ))}
          <div>
            <p className="text-sm text-gray-600">
              Total: {cart.precoTotal}
            </p>
          </div>
        </div>
      )}

      <div className="mt-6">
        <button
          onClick={() => navigate('/')}
          className="bg-primary px-6 py-2 text-white rounded-full"
        >
          Continuar Comprando
        </button>
      </div>
    </div>
  );
};

export default MyCart;
