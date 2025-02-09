import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { BsFillCartFill } from 'react-icons/bs';
import { SlLogout } from 'react-icons/sl';
import { findCartById } from '../../api/cartService';
import avatar from '../../assets/avatar.png';

const NavBar = () => {
  const navigate = useNavigate();
  const { isLogged, logoutUser, userFull } = useContext(AuthContext);
  const [productsQuantityCart, setProductQuantityCart] = useState(0);
  const [cartId, setCartId] = useState('');

  useEffect(() => {
    findCart();
  }, []);

  const findCart = async () => {
    const storedCartId = localStorage.getItem('carrinhoId');
    setCartId(storedCartId);

    try {
      const response = await findCartById(storedCartId);
      const productQuantity = response.data.produtos.reduce((acc, product) => acc + product.quantidade, 0);
      setProductQuantityCart(productQuantity);
    } catch (error) {
      console.error(`Network Error: ${error}`);
    }
  };

  return (
    <header className="bg-gray-900 shadow-md w-full">
      <nav className="max-w-screen-xl mx-auto flex justify-between items-center px-6 py-4">
        {/* Logo */}
        <h1 className="text-2xl font-bold text-green-400 cursor-pointer" onClick={() => navigate('/')}>
          PhantomMart
        </h1>

        {/* Navegação */}
        <div className="flex items-center space-x-6">
          {isLogged ? (
            <>
              {/* Carrinho de Compras */}
              <div className="relative cursor-pointer" onClick={() => navigate('/admin/my-cart', { state: { carrinhoId: cartId } })}>
                <BsFillCartFill className="text-white w-6 h-6 transition-transform hover:scale-110" />
                {productsQuantityCart >= 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                    {productsQuantityCart}
                  </span>
                )}
              </div>

              {/* Informações do Usuário */}
              <div className="flex items-center space-x-4">
                <p className="text-gray-300 text-sm">{userFull ? userFull.name : 'User'}</p>
                <button
                  onClick={() => navigate('/admin')}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-1 rounded-full text-sm transition-all"
                >
                  Admin
                </button>

                {/* Avatar */}
                <img
                  src={userFull ? userFull.images : avatar}
                  alt="User"
                  className="w-8 h-8 rounded-full border border-gray-400"
                />

                {/* Logout */}
                <SlLogout
                  onClick={logoutUser}
                  className="text-white w-6 h-6 cursor-pointer hover:text-red-500 transition-colors"
                  aria-label="Sair"
                />
              </div>
            </>
          ) : (
            <>
              <button onClick={() => navigate('/login')} className="text-gray-300 hover:text-white transition">
                Login
              </button>
              <button
                onClick={() => navigate('/register')}
                className="bg-green-500 hover:bg-green-400 text-white px-5 py-2 rounded-full transition-all duration-300 hover:scale-105"
              >
                Register
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default NavBar;
