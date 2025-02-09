import api from './api';

const findAllCategories = () => api.get('/api/categorias/');

export { findAllCategories };