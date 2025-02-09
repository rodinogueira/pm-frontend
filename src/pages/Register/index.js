import React, { useState } from 'react'
import logo from '../../assets/logo.png'
import { register } from '../../api/userAuth';
import { useNavigate } from 'react-router-dom';
const Register = () => {
  const navigate = useNavigate();
  
  const [items, setItens] = useState({
    name: '',
    email: '',
    password: '',
    images: 'img.leosite.com.br/leo.jpg',
    admin: true,
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
    
    // if (!items.name || !items.email || !items.password || !items.images || !items.admin) {
    //   console.error('Email and password are required.');
    //   return;
    // }
    
    const user = { name: items.name, email: items.email, password: items.password, images: items.images, admin: items.admin };

    userRegister(user);
    navigate('/login')
  }

  const userRegister = async(user) => {
    try {
      const response = await register(user);
      return response;
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
                    <input type='name' placeholder='Digite seu nome:' name='name'
                        className='w-full px-4 py-3 rounded-lg ring-red-200 border border-gray-400 focus:ring-4 focus:outline-none transition duration-300 focus:shadow-xl'
                        onChange={handleChange}
                        value={items.name}
                    />
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
                    <input type='text' placeholder='Digite sua img url:' name='images'
                        className='w-full px-4 py-3 rounded-lg ring-red-200 border border-gray-400 focus:ring-4 focus:outline-none transition duration-300 focus:shadow-xl'
                        onChange={handleChange}
                        value={items.images}
                    />
                </div>
                <button type='submit' className='w-full py-3 mt-6 bg-primary text-white focus:outline-none focus:ring-4 rounded-lg transition duration-300'>
                    Register
                </button>
            </form>
        </div>
    </main>
  )
}

export default Register;
