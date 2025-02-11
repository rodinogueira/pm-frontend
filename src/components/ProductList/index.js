import React, { useState, useEffect, forwardRef } from 'react';
import Product from '../Product';
import { findAll } from '../../api/productService';

const ProductList = forwardRef((props, ref) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1); // Página atual
  const [totalPages, setTotalPages] = useState(0); // Total de páginas
  const [limit] = useState(9); // Quantidade de produtos por página

  // Carrega os produtos quando a página mudar
  useEffect(() => {
    findAllProducts(); // Carrega os produtos ao iniciar ou mudar a página
  }, [page]); // Recarrega quando a página muda

  const findAllProducts = async () => {
    setLoading(true);
    try {
      console.log('Carregando página', page);

      const response = await findAll({
        limit,
        page,
      });

      // Verifique a resposta da API
      console.log('Resposta da API:', response.data);
      
      setProducts(response.data.products); // Atualize os produtos
      setTotalPages(response.data.totalPages); // Atualize o total de páginas
    } catch (error) {
      console.error('Erro ao carregar produtos', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      console.log(newPage, 'newPage')
      setPage(newPage); // Muda para a página solicitada
    }
  };

  return (
    <section ref={ref} tabIndex={-1} className='my-12 max-w-screen-xl mx-auto px-3'>
      {/* Listagem de produtos */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-2 mt-12'>
        {products.map((product) => (
          <Product key={product._id} product={product} />
        ))}
      </div>

      {/* Paginação */}
      <div className="flex justify-center mt-8">
        {loading ? (
          <p>Carregando...</p>
        ) : (
          <div className="flex space-x-2">
            {/* Botão de Página Anterior */}
            <button
              onClick={() => handlePageChange(page - 1)}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              disabled={page === 1}
            >
              Anterior
            </button>

            {/* Números das páginas */}
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                className={`px-4 py-2 text-sm font-semibold rounded-md 
                  ${page === index + 1
                    ? "bg-primary text-white"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  }`}
              >
                {index + 1}
              </button>
            ))}

            {/* Botão de Página Seguinte */}
            <button
              onClick={() => handlePageChange(page + 1)}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              disabled={page === totalPages}
            >
              Seguinte
            </button>
          </div>
        )}
      </div>
    </section>
  );
});

export default ProductList;
