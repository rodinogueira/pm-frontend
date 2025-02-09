import React from 'react'
import ProductList from '../../components/ProductList'
export default function Home() {
  return (
    <>
        <section className='home-banner w-full'>
            <div className='flex flex-col items center justify-center h-full'>
                {/* <h1 className='text-center text-3x1 md:text-4x1 lg:text-5x1 font-semibold text-gray-700'>Home</h1> */}
            </div>
        </section>
        <ProductList/>
    </>
  )
}
