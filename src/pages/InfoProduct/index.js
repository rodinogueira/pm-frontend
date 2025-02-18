import React, { useState, useEffect, useContext } from 'react';
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

  const frete = 5; // Taxa de entrega
  const product = useProduct(id); // Hook para pegar o produto com base no id
  const { addToCart } = useCart(userFull._id, frete);

  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState('0.00');
  const [lastProductId, setLastProductId] = useState(id); // Para armazenar o último produto selecionado

  // Atualiza o valor total sempre que o produto ou a quantidade mudar
  useEffect(() => {
    if (product && id !== lastProductId) {
      // Atualiza o lastProductId quando o produto muda
      setLastProductId(id);
      setQuantity(1); // Reseta a quantidade ao mudar o produto
    }
    if (product) {
      // Recalcula o total quando o produto for carregado
      const calculatedTotal = (product.precoUnitario * quantity) + frete;
      setTotalPrice(calculatedTotal.toFixed(2));
    }
  }, [product, quantity, id, lastProductId]); // Quando o produto ou a quantidade mudarem, recalcula o total

  const handleAddToCart = async () => {
    if (!product) return;
    await addToCart(product, quantity);
    navigate('/cart', { state: { carrinhoId: id } });
  };

  if (!product) return <div className="text-center text-lg font-semibold mt-10">Carregando...</div>;

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

          {/* Exibindo o valor total */}
          <div className="mt-4">
            <div className="text-xl font-semibold">Detalhes do Preço:</div>
            <div className="flex justify-between text-lg mt-2">
              <span>Produto: R$ {product.precoUnitario} x {quantity}</span>
              <span>R$ {(product.precoUnitario * quantity).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg mt-2">
              <span>Taxa de Entrega:</span>
              <span>R$ {frete}</span>
            </div>
            <div className="flex justify-between text-lg mt-4 font-bold">
              <span>Total + Taxa:</span>
              <span>R$ {totalPrice}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
