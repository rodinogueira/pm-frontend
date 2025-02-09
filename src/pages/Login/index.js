import React, { useState, useContext } from 'react'
import logo from '../../assets/logo.png'
import { AuthContext } from '../../context/AuthContext'
const Login = () => {
  const { loginUser } = useContext(AuthContext)
  const [items, setItens] = useState({
    email: '',
    password: '',
  })

  const handleChange = (e) => {
    const {name, value} = e.target

    setItens(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!items.email || !items.password) {
      console.error('Email and password are required.');
      return;
    }

    const user = { email: items.email, password: items.password };

    try {
      loginUser(user);
    } catch (error) {
      // Handle network errors or other unexpected issues
      console.error('Network Error:', error);
      throw error;
    }
  }

  return (
    <main className='h-screen w-full'>
        <div className='flex flex-col items-center justify-center pt-20 h-screen'>
            <img className="w-36 h-20" src={logo} alt='logotipo food app' />
            <form action='' onSubmit={handleSubmit} className='bg-white w-96 mt-6 p-4 rounded-lg shadow-lg'>
                <div className='flew flew-col space-y-6'>
                    <input type='email' placeholder='Digite seu email:' name='email'
                        className='w-full px-4 py-3 rounded-lg ring-red-200 border border-gray-400 focus:ring-4 focus:outline-none transition duration-300 focus:shadow-xl'
                        onChange={handleChange}
                        value={items.email}
                    />
                    <input type='password' placeholder='Digite sua senha:' name='password'
                        className='w-full px-4 py-3 rounded-lg ring-red-200 border border-gray-400 focus:ring-4 focus:outline-none transition duration-300 focus:shadow-xl'
                        onChange={handleChange}
                        value={items.password}
                    />
                </div>
                <button className='w-full py-3 mt-6 bg-primary text-white focus:outline-none focus:ring-4 rounded-lg transition duration-300'>
                    Entrar
                </button>
                <p className='text-base text-primary text-center my-6 hover:underline'>Precisa de uma contar</p>
            </form>
        </div>
    </main>
  )
}

export default Login;
