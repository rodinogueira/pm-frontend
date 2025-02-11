import api from './api'

export const createCart = (cart) => api.post('/api/carrinhos', cart);
export const findCartById = (id) => api.get(`/api/carrinhos/${id}`);
export const removeCartById = (id) => api.delete(`/api/carrinhos/${id}`);
export const removeProductFromCart = (carrinhoId, productId) => api.delete(`/api/carrinhos/${carrinhoId}/produto/${productId}`);
export const updateCart = (id, cartData) => api.put(`/api/carrinhos/${id}`, cartData);