import React, { useEffect, useState, useContext } from 'react'
import {findAllCategories} from '../../api/categoryService'
import {addProduct} from '../../api/productService'
import { MultiSelect } from 'react-multi-select-component'
import { AuthContext } from '../../context/AuthContext';

const AddProduct = () => {
  const { userFull } = useContext(AuthContext);
  console.log(userFull._id, 'userFulluserFull')
  const [productForm, setProductForm] = useState({
    nome: '',
    descricao: '',
    precoUnitario: 0,
    imagem: '',
    codigoBarra: 0,
    categorias: [{ _id: '' }],
    owner: userFull._id,
  })

  const [categories, setCategories] = useState([]);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    getCategories()
  }, [])

  const getCategories = async () => {
    try{
      const response = await findAllCategories();
      const categoriesSelect = response.data.map(category => {
        return {
          value: category._id,
          label: category.nome,
        }
      });

      setCategories(categoriesSelect)
    } catch(error) {
      console.error('Error during get categories:', error.message);
      throw error;
    }
  }

  const handleChangeValues = (e) => {
    const {name, value} = e.target

    setProductForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    // const categoriesId = selected.map(id => {
    //   return {
    //     _id: id.value
    //   }
    // })

    const product = {
      ...productForm,
      nome: productForm.nome,
      descricao: productForm.descricao,
      precoUnitario: productForm.precoUnitario,
      imagem: productForm.imagem,
      codigoBarra: productForm.codigoBarra,
      owner: userFull._id,
      // categorias: categoriesId
    }

    createProduct(product)
  }

  const createProduct = async(product) => {
    try {
      await addProduct(product)
    } catch (error) {
      // Handle network errors or other unexpected issues
      console.error('Network Error:', error);
      throw error;
    }
  }

  return (
<section className='my-12 max-w-screen-xl mx-auto px-6'>
    <div className='flex flex-col space-y-2'>
        <h1 className='text-3xl font-semibold text-gray-700'>Cadastro de Produtos</h1>
        <p className='text-sm text-gray-500'>Preencha as informações abaixo para adicionar um novo produto.</p>
    </div>
    <form onSubmit={handleSubmit} className='grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-10 mt-6'>
        <div className='flex flex-col space-y-4'>
            <label htmlFor='nome' className='text-gray-600 text-sm font-medium'>Nome</label>
            <input
                className='w-full px-4 py-3 rounded-lg border border-gray-400 ring-red-200 focus:ring-4 focus:outline-none transition duration-300 focus:shadow-xl'
                type='text'
                id='nome'
                name='nome'
                required
                onChange={handleChangeValues}
                value={productForm.nome}
            />
            <label htmlFor='descricao' className='text-gray-600 text-sm font-medium'>Descrição</label>
            <textarea
                className='w-full px-4 py-3 rounded-lg border border-gray-400 ring-red-200 focus:ring-4 focus:outline-none transition duration-500 resize-none'
                id='descricao'
                name='descricao'
                cols='30'
                rows='5'
                required
                onChange={handleChangeValues}
                value={productForm.descricao}
            ></textarea>
            <label htmlFor='codigoBarra' className='text-gray-600 text-sm font-medium'>Código de Barras</label>
            <input
                className='w-full px-4 py-3 rounded-lg border border-gray-400 ring-red-200 focus:ring-4 focus:outline-none transition duration-300 focus:shadow-xl'
                type='number'
                id='codigoBarra'
                name='codigoBarra'
                required
                onChange={handleChangeValues}
                value={productForm.codigoBarra}
            />
        </div>
        <div className='flex flex-col space-y-4'>
            <label htmlFor='precoUnitario' className='text-gray-600 text-sm font-medium'>Preço</label>
            <input
                className='w-full px-4 py-3 rounded-lg border border-gray-400 ring-red-200 focus:ring-4 focus:outline-none transition duration-300 focus:shadow-xl'
                type='number'
                id='preco'
                name='precoUnitario'
                required
                onChange={handleChangeValues}
                value={productForm.preco}
            />
            <label htmlFor='imagem' className='text-gray-600 text-sm font-medium'>Imagem</label>
            <input
                className='w-full px-4 py-3 rounded-lg border border-gray-400 ring-red-200 focus:ring-4 focus:outline-none transition duration-300 focus:shadow-xl'
                type='text'
                id='imagem'
                name='imagem'
                required
                onChange={handleChangeValues}
                value={productForm.imagem}
            />
            <label htmlFor='title' className='text-gray-600 text-sm font-medium'>Categoria</label>
            <MultiSelect
                options={categories}
                value={selected}
                onChange={setSelected}
                labelledBy='Select'
            />
            <div className='mt-8'>
                <button className='w-full py-3 mt-6 bg-primary text-white focus:outline-none focus:ring-4 rounded-lg transition duration-300'>
                    Adicionar
                </button>
            </div>
        </div>
    </form>
</section>

  )
}

export default AddProduct