import api from './api'

export const login = (user) => api.post('/api/users/login', user);
export const register = (user) => api.post('/api/users', user);
export const findUserById = (userId) => api.get(`/api/users/${userId}`);