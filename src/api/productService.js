import api from './api'

const addProduct = (product) => api.post('/api/products', product);
const edit = (id, newProduct) => api.put(`/api/products/${id}`, newProduct);
const findAll = (page, limit) => api.get('/api/products', { params: { page, limit } });
const findProductById = (id) => api.get(`/api/products/${id}`);
const del = (id) => api.delete(`/api/products/${id}`);
const findByOwner = (ownerId) => api.get(`/api/products/owner/${ownerId}`);

export {
    addProduct,
    findAll,
    edit,
    findProductById,
    del,
    findByOwner,
}