import React, { useState, useEffect, useContext } from 'react'
import { Link, useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from 'react-icons/fa';
import { del, findByOwner } from '../../api/productService';
import { AuthContext } from '../../context/AuthContext';

const Admin = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const { userFull } = useContext(AuthContext);
    
    useEffect(() => {
        findAllProducts();
    }, []);

    const findAllProducts = async () => {
        const owner = userFull._id;
        if(!owner) return;

        try {
            const response = await findByOwner(owner);
            setProducts(response.data);
        } catch (error) {
            throw error;
        }
    };

    const deleteProduct = async (id) => {
        try {
            await del(id);
            findAllProducts();
        } catch (error) {
            throw error;
        }
    };

    return (
        <section className='my-12 max-w-screen-xl mx-auto px-6'>
            <div className='flex justify-end mb-6'>
                <button
                    onClick={() => navigate('/add-product')}
                    className='w-44 bg-green-600 py-3 text-white ring-green-400 focus:outline-none focus:ring-4 rounded-lg transition duration-300 transform hover:bg-green-700'
                >
                    Adicionar Produto
                </button>
            </div>
            <div className='flex flex-col'>
                <div className='overflow-x-auto sm:-mx-6 lg:-mx-8'>
                    <div className='py-2 inline-block min-w-full sm:px-6 lg:px-8'>
                        <div className='overflow-hidden sm:rounded-lg shadow-lg bg-gray-800'>
                            <table className='min-w-full'>
                                <thead className='bg-green-600'>
                                    <tr>
                                        <th scope="col" className='text-xs font-medium text-white px-6 py-3 text-left uppercase tracking-wider'>
                                            Imagem
                                        </th>
                                        <th scope="col" className='text-xs font-medium text-white px-6 py-3 text-left uppercase tracking-wider'>
                                            Nome
                                        </th>
                                        <th scope="col" className='text-xs font-medium text-white px-6 py-3 text-left uppercase tracking-wider'>
                                            Preço
                                        </th>
                                        <th scope="col" className='text-xs font-medium text-white px-6 py-3 text-left uppercase tracking-wider'>
                                            Código de Barras
                                        </th>
                                        <th scope="col" className='relative px-6 py-3'>
                                            <span className='text-xs font-medium text-white px-6 py-3 text-left uppercase tracking-wider'>Ações</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((product) => (
                                        <tr key={product._id} className='bg-white border-b'>
                                            <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                                                <img className='w-16 rounded-lg' src={product.imagem} alt={product.nome} />
                                            </td>
                                            <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                                                {product.nome}
                                            </td>
                                            <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                                                R${product.precoUnitario.toFixed(2)}
                                            </td>
                                            <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                                                {product.codigoBarra}
                                            </td>
                                            <td className='px-6 py-4 whitespace-nowrap flex items-center justify-center space-x-3'>
                                                <Link to={`/admin/edit-product/${product._id}`}>
                                                    <FaEdit className='cursor-pointer text-xl text-green-600 hover:text-green-800 transition duration-300' />
                                                </Link>
                                                <FaTrash onClick={() => deleteProduct(product._id)} className='cursor-pointer text-xl text-red-600 hover:text-red-800 transition duration-300' />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Admin;
