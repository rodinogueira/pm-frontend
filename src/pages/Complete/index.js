import React from 'react'

const Complete = () => {
    return (
        <main className='h-screen banner'>
            <div className='max-w-screen-xl py-20 mx-auto px-6'>
                <div className='flex flex-col items-center justify-center h-3/4 pt-24'>
                    <h1 className='text-3xl text-center text-primary font-semibold poppins flex space-x-6 items-center'>
                        Pedido Realizado
                    </h1>
                    {/*Pegar imagem no unDraw*/}
                    {/* <img src={complete} className='w-96 object-contain' alt='Imagem representando sucesso no pedido' srcSet=''/> */}
                    <button className='bg-primary text-white px-8 py-2 focus:outline-none poppins rounded-full mt-24 transition duration-300 hover:scale-105'>
                        Voltar para Home
                    </button>
                </div>
            </div>
        </main>
    )
}

export default Complete;