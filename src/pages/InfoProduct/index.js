import React, { useState, useContext } from 'react';
import { AiOutlineMinusCircle, AiOutlinePlusCircle } from 'react-icons/ai';
import { FiShoppingCart } from 'react-icons/fi';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { useProduct } from '../../hooks/useProduct';
import { useCart } from '../../hooks/useCart';

const ProductInfo = () => {
  const navigate = useNavigate();
  const { userFull } = useContext(AuthContext);
  const { id } = useParams();

  const frete = 5;
  const product = useProduct(id);
  const { addToCart } = useCart(userFull._id, frete);

  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = async () => {
    if (!product) return;
    await addToCart(product, quantity);
    navigate('/cart', { state: { carrinhoId: id } });
  };

  if (!product) return <div className="text-center text-lg font-semibold mt-10">Carregando...</div>;

  const totalPrice = (product.precoUnitario * quantity).toFixed(2);

  return (
    <div className="max-w-screen-lg mx-auto px-6 my-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Imagem do Produto */}
        <div className="flex justify-center">
          <img 
            src={product.imagem} 
            alt={product.nome} 
            className="w-full max-w-md rounded-lg shadow-md transition-transform duration-300 hover:scale-105"
          />
        </div>

        {/* Informações do Produto */}
        <div className="flex flex-col">
          <h1 className="text-4xl font-bold text-gray-800">{product.nome}</h1>
          <p className="text-gray-600 text-lg mt-4">{product.descricao}</p>
          
          <h2 className="text-3xl font-bold text-blue-600 mt-6">R$ {totalPrice}</h2>
          
          <div className="flex items-center mt-6 space-x-4">
            {/* Controle de Quantidade */}
            <div className="flex items-center border border-gray-300 rounded-full px-4 py-2 space-x-4">
              <AiOutlineMinusCircle
                onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
                className="w-8 h-8 text-gray-600 cursor-pointer hover:text-gray-800 transition"
              />
              <span className="text-xl font-medium">{quantity}</span>
              <AiOutlinePlusCircle
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 text-gray-600 cursor-pointer hover:text-gray-800 transition"
              />
            </div>

            {/* Botão Adicionar ao Carrinho */}
            <button 
              onClick={handleAddToCart} 
              className="flex items-center bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-3 rounded-full transition duration-300 shadow-md"
            >
              <FiShoppingCart className="text-xl" />
              <span className="ml-2">Adicionar ao Carrinho</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;