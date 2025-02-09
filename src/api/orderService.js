import api from './api';

const send = (cartInfo) => api.post('/api/carrinhos', cartInfo);
const addOrder = (order) => api.post('/api/pedidos', order);

export { send, addOrder };