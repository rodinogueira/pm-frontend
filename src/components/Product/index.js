import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { findUserById } from "../../api/userAuth";

const Product = ({ product }) => {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState("Name");
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    findUser(product.owner);
  }, []);

  const findUser = async (ownerId) => {
    if (!ownerId) return null;
    try {
      const response = await findUserById(ownerId);
      setNickname(response.data.name);
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className="relative transition-all duration-500 hover:scale-[1.05] overflow-hidden group">
      
      {/* Imagem destacada */}
      <div className="relative w-full h-[40%] overflow-hidden rounded-t-3xl">
        <img
          src={product.imagem}
          alt={product.nome}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      {/* Conteúdo do card */}
      <div className="p-6 flex flex-col items-center text-center bg-gray-800 rounded-b-3xl shadow-lg space-y-2">
        
        {/* Nome do dono com efeito vidro */}
        <span className="absolute top-4 left-4 bg-white/20 backdrop-blur-md text-xs font-semibold px-3 py-1 rounded-full shadow-md border border-white/10">
          {nickname}
        </span>

        {/* Nome do Produto com ênfase */}
        <h1 className="text-white text-lg font-bold tracking-wide mt-2 truncate w-full">
          {product.nome}
        </h1>

        {/* Descrição com truncamento */}
        <div className={`text-gray-400 text-sm mt-1 ${expanded ? "" : "h-20 overflow-hidden"}`}>
          <p className={`${expanded ? "" : "line-clamp-2"}`}>
            {product.descricao}
          </p>

          {/* Botão "Ver mais" se a descrição for longa */}
          {product.descricao.length > 80 && (
            <button
              className="text-blue-400 text-xs mt-1 hover:underline transition-all duration-200"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? "Ver menos" : "Ver mais"}
            </button>
          )}
        </div>

        {/* Preço destacado com efeito neon */}
        <h2 className="text-primary text-3xl font-extrabold mt-2 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all duration-300">
          {product.precoUnitario}
        </h2>

        {/* Botão animado com efeito gradiente */}
        <button
          onClick={() => navigate(`/info-product/${product._id}`)}
          className="relative overflow-hidden bg-gradient-to-r from-red-600 to-orange-500 text-white px-10 py-3 rounded-full text-sm font-medium shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-2xl mt-4"
        >
          🚀 Pedir Agora
        </button>
      </div>
    </div>
  );
};

export default Product;
