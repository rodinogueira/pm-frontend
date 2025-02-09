import React, { useState, createContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { login, findUserById } from '../api/userAuth';
import api from '../api/api';

export const AuthContext = createContext();

const AuthProvider = ({children}) => {
    const navigate = useNavigate();
    const [isLogged, setIsLogged] = useState(false)
    const [loading, setLoading] = useState(true)
    const [userFull, setUserFull] = useState({})

    useEffect(() => {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (userInfo) {
        findUser(userInfo);
        setUserFull(userInfo);
        setIsLogged(true);
      } else {
        console.log('User not logged'); 
      }

      setLoading(false);
    }, [])
    
    const loginUser = async (payload) => {
      try {
        const response = await login(payload)
        localStorage.setItem('userInfo', JSON.stringify(response.data));
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`
        setIsLogged(true)
        navigate('/');
      } catch (error) {
        console.error('Error during login:', error.message);
        throw error;
      }
    };

    const findUser = async (userInfo) => {      
      if (!userInfo) {
        console.error('User information is missing.');
        return;
      }

      try {
        const { token, user: { _id: userId } } = userInfo

        api.defaults.headers.common['Authorization'] = `Bearer ${token}`

        const response = await findUserById(userId)

        setUserFull(response.data);
      } catch (error) {
        console.error('Error during login:', error.message);
        throw error;
      }
    };

    const logoutUser = () => {
      setIsLogged(false);
      localStorage.clear();
      navigate('/login')
    }
    
    if(loading) {
      return <h1>Loading...</h1>
    } 
  
  return (
    <AuthContext.Provider value={{isLogged, loginUser, logoutUser, userFull}}>
        {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider;