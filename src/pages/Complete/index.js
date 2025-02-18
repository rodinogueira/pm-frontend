import React, { useEffect } from 'react'
import { findOrderById } from '../../api/orderService';
import { useLocation } from "react-router-dom";
import qrcode from '../../assets/qrcode.jpeg'

const Complete = () => {
    const location = useLocation();
    const orderId = location.state?.orderId;
    console.log(orderId, 'orderIdorderId');

    useEffect(() => {
        findOrderData(orderId);
    },[]);

    const findOrderData = async() => {
        const response = await findOrderById(orderId);
        console.log(response);
    }

    return (
        <main className='h-screen banner'>
        <div className='max-w-screen-xl mx-auto px-6'>
            <div className='flex flex-col items-center justify-center h-3/4 pt-24'>
            <h1 className='text-3xl text-center text-primary font-semibold poppins flex space-x-6 items-center'>
                Pedido Realizado
            </h1>
            {orderId ? <p>Order ID: {orderId}</p> : ''}
            {/* Pegar imagem no unDraw */}
            <img className='w-64 object-contain mt-8' src={qrcode} alt='qrcode phantom' />
            <button className='bg-primary text-white px-8 py-2 focus:outline-none poppins rounded-full mt-24 transition duration-300 hover:scale-105'>
                Voltar para Home
            </button>
            </div>
        </div>
        </main>

    )
}

export default Complete;