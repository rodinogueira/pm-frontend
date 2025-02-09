import React, { useState, useEffect } from 'react'
import Product from '../Product'
import { findAll } from '../../api/productService';

const ProductList = () => {
  const [categorias] = useState(['Home', 'Admin', 'Support'])
  const [categoriaAtiva, setCategoriaAtiva] = useState('Home');
  const [products, setProducts] = useState([])

  useEffect(() => {
      findAllProducts()
  }, []);

  const findAllProducts = async () => {
      try{
          const response = await findAll();

          setProducts(response.data);
      } catch(error) {
          throw error;
      }
  }

  return (
    <section className='my-12 max-w-screen-xl mx-auto px-3'>
        <div className="flex items-center justify-center space-x-4">
          {categorias.map((categoria) => (
            <button
              key={categoria}
              className={`px-6 py-2 text-sm font-semibold rounded-full transition-all duration-300 shadow-md 
                ${
                  categoriaAtiva === categoria
                    ? "bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg scale-105"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              onClick={() => setCategoriaAtiva(categoria)}
            >
              {categoria}
            </button>
          ))}
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-12'>    
          {products.map((product) => (
            <Product key={product._id} product={product}/>
          ))}        
        </div>
    </section>
  )
}   

export default ProductList;