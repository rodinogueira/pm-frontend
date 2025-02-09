import React from "react";
import { useNavigate } from "react-router-dom";

const Product = ({ product }) => {
  const navigate = useNavigate();
  return (
    <div className="relative bg-gray-900 border border-gray-700 rounded-3xl shadow-xl transition-transform duration-500 hover:scale-[1.05] overflow-hidden group">
      
      {/* Imagem sem bordas, cobrindo 35% do topo */}
      <div className="relative w-full h-[40%]">
        <img
          src={product.imagem}
          alt={product.nome}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      {/* Conteúdo do card */}
      <div className="p-6 flex flex-col items-center text-center bg-gray-900 rounded-b-3xl">
        
        {/* Categoria com efeito vidro */}
        {/* <span className="absolute top-4 left-4 bg-white/20 backdrop-blur-lg text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md border border-white/10">
          {product.categoria || "Brasileira"}
        </span> */}
        
        {/* Categoria com efeito vidro */}
        <span className="absolute top-4 left-4 bg-white/20 backdrop-blur-lg text-xs font-semibold px-3 py-1 rounded-full shadow-md border border-white/10">
          {product.owner}
        </span>

        {/* Nome e descrição */}
        <h1 className="text-white text-lg font-semibold tracking-wide mt-4">{product.nome}</h1>
        <p className="text-gray-400 text-sm mt-1">{product.descricao}</p>

        {/* Preço com efeito neon */}
        <h2 className="text-primary text-3xl font-extrabold drop-shadow-lg mt-3 group-hover:animate-pulse">
          {product.precoUnitario}
        </h2>

        {/* Botão animado */}
        <button
          onClick={() => navigate(`/info-product/${product._id}`)}
          className="relative overflow-hidden bg-gradient-to-r from-red-600 to-orange-500 text-white px-10 py-3 rounded-full text-sm font-medium shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl mt-5"
        >
          🚀 Pedir Agora
        </button>

      </div>
    </div>
  );
};

export default Product;
