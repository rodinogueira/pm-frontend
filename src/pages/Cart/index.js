import React, { useState, useEffect, useContext } from "react";
import {
  AiOutlineDelete,
  AiOutlineMinusCircle,
  AiOutlinePlusCircle,
} from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import axios from 'axios';
import {
  findCartById,
  updateCart,
  removeProductFromCart,
} from "../../api/cartService";
import { findProductById } from "../../api/productService";
import { addOrder } from "../../api/orderService";

const Cart = () => {
  const navigate = useNavigate();
  const { userFull } = useContext(AuthContext);
  const carrinhoId = localStorage.getItem("carrinhoId");
  const [address, setAddress] = useState({
    rua: "",
    numero: "",
    complemento: "",
    cep: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState({ produtos: [], frete: 0, precoTotal: 0 });

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

      // Buscar detalhes dos produtos
      const produtosComDetalhes = await Promise.all(
        cartData.produtos.map(async (produto) => {
          const productDetails = await findProductById(produto._id);
          return { ...produto, ...productDetails.data };
        })
      );

      // Recalcular o total com base nos produtos
      const updatedTotal = produtosComDetalhes.reduce((total, product) => {
        return total + product.precoUnitario * product.quantidade;
      }, cartData.frete);

      setCart({
        ...cartData,
        produtos: produtosComDetalhes,
        precoTotal: updatedTotal,
      });
    } catch (error) {
      setError("Erro ao buscar o carrinho. Por favor, tente novamente.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
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

      // Atualizar o carrinho novamente para obter os dados mais recentes
      fetchCart(cart._id);
    } catch (error) {
      setError("Erro ao remover o produto.");
    }
  };

  const sendOrder = async () => {
    if (!cart?.produtos?.length) return setError("Carrinho está vazio!");

    setLoading(true);

    const cartInfo = {
      produtos: cart.produtos.map((product) => ({
        _id: product._id,
        quantidade: product.quantidade,
      })),
      frete: cart.frete,
      precoTotal: cart.precoTotal,
      userId: userFull?._id,
      concluido: true,
      userEmail: userFull?.email,
      address: address,
    };

    try {
      const responseOrder = await addOrder(cartInfo);

      if (responseOrder.data) {
        localStorage.removeItem("productCart");
        navigate("/complete", { state: { orderId: responseOrder.data._id } });
      }
    } catch (error) {
      setError("Erro ao enviar o pedido.");
    } finally {
      setLoading(false);
    }
  };

  const findAddress = async () => {
    if (address.cep.length === 8) {
      try {
        const response = await axios.get(
          `https://viacep.com.br/ws/${address.cep}/json`
        );
        setAddress({
          ...address,
          rua: `${response.data.logradouro}, ${response.data.bairro}, ${response.data.localidade}`,
        });
      } catch (error) {
        console.error("Erro ao buscar o CEP", error);
        setError(
          "Erro ao buscar o CEP. Por favor, verifique o endereço e tente novamente."
        );
      }
    }
  };

  return (
    <main className="h-screen banner">
      <div className="max-w-screen-xl py-20 mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Formulário de Endereço */}
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl text-white font-semibold border-b-2 border-gray-500 pb-4">
              Adicione seu endereço
            </h2>
            <form className="mt-6">
              <div className="flex flex-col space-y-3">
                <input
                  className="w-full px-5 py-3 rounded-lg border border-gray-500 text-white bg-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:outline-none"
                  type="text"
                  name="cep"
                  placeholder="cep:"
                  id="cep"
                  value={address.cep}
                  onChange={handleChange}
                />
                <input
                  className="w-full px-5 py-3 rounded-lg border border-gray-500 text-white bg-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:outline-none"
                  type="text"
                  name="rua"
                  placeholder="rua:"
                  id="rua"
                  value={address.rua}
                  onFocus={findAddress}
                  onChange={handleChange}
                />
                <input
                  className="w-full px-5 py-3 rounded-lg border border-gray-500 text-white bg-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:outline-none"
                  type="text"
                  name="numero"
                  placeholder="numero:"
                  id="numero"
                  value={address.numero}
                  onChange={handleChange}
                />
                <input
                  className="w-full px-5 py-3 rounded-lg border border-gray-500 text-white bg-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:outline-none"
                  type="text"
                  name="complemento"
                  placeholder="complemento:"
                  id="complemento"
                  value={address.complemento}
                  onChange={handleChange}
                />
              </div>
            </form>
          </div>

          {/* Carrinho */}
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
                    {/* Imagem do Produto */}
                    <img
                      src={product.imagem || "https://via.placeholder.com/150"}
                      alt={product.nome}
                      className="w-20 h-20 object-cover rounded-md"
                    />

                    {/* Nome e Preço */}
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

                    {/* Controles de Quantidade */}
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

                    {/* Botão de Remover */}
                    <AiOutlineDelete
                      onClick={() => remove(product._id)}
                      className="w-6 h-6 text-red-500 cursor-pointer transition-transform hover:scale-110 ml-4"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Resumo */}
            <div className="my-6 p-4 bg-gray-800 rounded-lg border border-gray-700 space-y-2">
              <div className="flex justify-between items-center text-gray-400">
                <span>Taxa de Entrega</span>
                <span className="font-medium text-white">${cart.frete}</span>
              </div>
              <div className="flex justify-between items-center text-gray-400">
                <span>Total + Taxa</span>
                <span className="font-semibold text-lg text-white">
                  ${cart.precoTotal}
                </span>
              </div>
            </div>

            {/* Botão de Envio */}
            <div>
              {loading ? (
                <button className="w-full px-6 py-3 rounded-lg bg-gray-600 text-white cursor-not-allowed">
                  Enviando Pedido...
                </button>
              ) : (
                <button
                  onClick={sendOrder}
                  className="w-full px-6 py-3 rounded-lg bg-green-600 text-white hover:bg-green-700"
                >
                  Finalizar Pedido
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Cart;
