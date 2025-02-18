import React, { useState, useEffect, useContext } from "react";
import {
  AiOutlineDelete,
  AiOutlineMinusCircle,
  AiOutlinePlusCircle,
} from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import {
  findCartById,
  updateCart,
  removeProductFromCart,
} from "../../api/cartService";
import { findProductById } from "../../api/productService";

const MyCart = () => {
  const navigate = useNavigate();
  const { userFull } = useContext(AuthContext);
  const carrinhoId = localStorage.getItem("carrinhoId");
  const [cart, setCart] = useState({ produtos: [], frete: 0, precoTotal: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (carrinhoId) {
      fetchCart(carrinhoId);
    }
  }, [carrinhoId]);

  const fetchCart = async (cartId) => {
    try {
      const response = await findCartById(cartId);
      const cartData = response.data || {
        produtos: [],
        frete: 0,
        precoTotal: 0,
      };
      const produtosComDetalhes = await Promise.all(
        cartData.produtos.map(async (produto) => {
          const productDetails = await findProductById(produto._id);
          return { ...produto, ...productDetails.data };
        })
      );
      setCart({ ...cartData, produtos: produtosComDetalhes });
    } catch (error) {
      setError("Erro ao buscar o carrinho. Por favor, tente novamente.");
    }
  };

  const updateQuantity = async (id, delta) => {
    const updatedProducts = cart.produtos.map((product) =>
      product._id === id
        ? { ...product, quantidade: Math.max(1, product.quantidade + delta) }
        : product
    );

    let updatedTotal = cart.frete || 0;
    updatedProducts.forEach((product) => {
      updatedTotal += product.precoUnitario * product.quantidade;
    });

    setCart((prevCart) => ({
      ...prevCart,
      produtos: updatedProducts,
      precoTotal: updatedTotal || 0,
    }));

    try {
      await updateCart(cart._id, {
        produtos: updatedProducts,
        precoTotal: updatedTotal,
      });
    } catch (error) {
      setError("Erro ao atualizar a quantidade.");
    }
  };

  const remove = async (id) => {
    try {
      await removeProductFromCart(cart._id, id);
      fetchCart(cart._id);
    } catch (error) {
      setError("Erro ao remover o produto.");
    }
  };

  return (
    <main className="h-screen banner">
      <div className="max-w-screen-xl py-20 mx-auto px-6">
        <div className="space-y-4">
          {!cart?.produtos?.length ? (
            <p className="text-gray-400 text-center">
              Seu carrinho está vazio.
            </p>
          ) : (
            <div className="space-y-3">
              {cart.produtos.map((product) => (
                <div
                  key={product._id}
                  className="bg-gray-900 border border-green-500 rounded-xl p-4 flex items-center justify-between"
                >
                  <img
                    src={product.imagem || "https://via.placeholder.com/150"}
                    alt={product.nome}
                    className="w-20 h-20 object-cover rounded-md"
                  />
                  <div className="flex-1 ml-4">
                    <span className="text-lg text-gray-300 font-semibold">
                      {product.nome}
                    </span>
                    <div className="text-gray-400 text-sm">
                      ${product.precoUnitario} x {product.quantidade} ={" "}
                      <span className="font-semibold text-white">
                        ${product.precoUnitario * product.quantidade}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <AiOutlineMinusCircle
                      onClick={() => updateQuantity(product._id, -1)}
                      className="w-6 h-6 text-gray-400 cursor-pointer hover:text-white"
                    />
                    <span className="text-lg font-medium text-white">
                      {product.quantidade}
                    </span>
                    <AiOutlinePlusCircle
                      onClick={() => updateQuantity(product._id, 1)}
                      className="w-6 h-6 text-gray-400 cursor-pointer hover:text-white"
                    />
                  </div>
                  <AiOutlineDelete
                    onClick={() => remove(product._id)}
                    className="w-6 h-6 text-red-500 cursor-pointer transition-transform hover:scale-110 ml-4"
                  />
                </div>
              ))}
            </div>
          )}
          {/* Valor Total */}
          {cart.produtos.length > 0 && (
            <div className="flex justify-between items-center mt-4 bg-gray-800 rounded-xl p-4">
              <span className="text-lg text-gray-300">Total:</span>
              <span className="text-2xl font-semibold text-white">
                ${cart.precoTotal || 0}
              </span>
            </div>
          )}
        </div>
        {/* Botão de continuar comprando */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => navigate("/")}
            className="bg-green-500 px-6 py-2 text-white rounded-full hover:bg-green-600 transition"
          >
            Continuar Comprando
          </button>
        </div>
      </div>
    </main>
  );
};

export default MyCart;
