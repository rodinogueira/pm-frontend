import api from './api';

const send = (cartInfo) => api.post('/api/carrinhos', cartInfo);
const addOrder = (order) => api.post('/api/pedidos', order);
const findOrder = () => api.get('/api/pedidos');
const findOrderById = (orderId) => api.get(`/api/pedidos/${orderId}`);

export { 
    send,
    addOrder,
    findOrder,
    findOrderById,
};