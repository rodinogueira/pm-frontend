import React, { useState, useEffect, useContext } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { findCartById } from "../../api/cartService";
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
      fetchCart(carrinhoId).catch((err) => setError(err.message));
    }
  }, [carrinhoId]);

  const fetchCart = async (cartId) => {
    try {
      const response = await findCartById(cartId);
      setCart(response.data || { produtos: [], frete: 0, precoTotal: 0 });
    } catch (error) {
      setError("Erro ao buscar o carrinho. Por favor, tente novamente.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const remove = (id) => {
    const storageCart = JSON.parse(localStorage.getItem("productCart")) || [];
    const filteredCart = storageCart.filter((product) => product._id !== id);
    localStorage.setItem("productCart", JSON.stringify(filteredCart));
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
        setError("Erro ao buscar o CEP. Verifique e tente novamente.");
      }
    }
  };

  const sendOrder = async () => {
    if (!cart?.produtos?.length) return setError("Carrinho está vazio!");

    setLoading(true);
    const productsOrder = cart.produtos.map((product) => ({
      _id: product._id,
      quantidade: product.quantidade,
    }));

    const cartInfo = {
      produtos: productsOrder,
      frete: cart.frete,
      precoTotal: cart.precoTotal,
      userId: userFull?._id,
      concluido: true,
    };

    try {
      const responseOrder = await addOrder(cartInfo);
      if (responseOrder.data) {
        localStorage.removeItem("productCart");
        navigate("/complete");
      }
    } catch (error) {
      setError("Erro ao enviar o pedido. Por favor, tente novamente.");
    } finally {
      setLoading(false);
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
    <div className="flex flex-col space-y-4">
      {["cep", "rua", "numero", "complemento"].map((field) => (
        <input
          key={field}
          className="w-full px-5 py-3 rounded-lg border border-gray-500 text-white bg-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:outline-none transition duration-300 ease-in-out transform hover:scale-105"
          type="text"
          name={field}
          placeholder={`${field.charAt(0).toUpperCase() + field.slice(1)}:`}
          value={address[field]}
          onChange={handleChange}
          onFocus={field === "rua" ? findAddress : undefined}
        />
      ))}
    </div>
  </form>
</div>


          {/* Carrinho */}
          <div className="space-y-4">
            {!cart?.produtos?.length ? (
              <p className="text-gray-400 text-center">Seu carrinho está vazio.</p>
            ) : (
              <div className="space-y-3">
                {cart.produtos.map((product) => (
                  <div
                    key={product._id}
                    className="bg-gray-900 border border-green-500 rounded-xl p-4 flex justify-between items-center"
                  >
                    <div className="flex items-center space-x-4">
                      <span className="text-lg text-gray-300 font-semibold">
                        {product.quantidade} un
                      </span>
                    </div>
                    <AiOutlineDelete
                      onClick={() => remove(product._id)}
                      className="w-6 h-6 text-red-500 cursor-pointer transition-transform duration-300 hover:scale-110"
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
                <span className="font-semibold text-lg text-white">${cart.precoTotal}</span>
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
                  className="w-full px-6 py-3 rounded-lg bg-green-600 text-white font-semibold transition duration-300 hover:bg-green-700 focus:ring-4 focus:ring-green-400"
                >
                  Enviar Pedido
                </button>
              )}
              {error && <p className="text-red-500 mt-3 text-center">{error}</p>}
            </div>
          </div>

        </div>
      </div>
    </main>
  );
};

export default Cart;
