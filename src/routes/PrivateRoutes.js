import React, { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { Navigate } from 'react-router-dom'
const PrivateRoutes = ({ children }) => {
    const { isLogged } = useContext(AuthContext);
    
    if(!isLogged) {
        return <Navigate to='/login' />
    } else {
        return children
    }
}

export default PrivateRoutes