import { post } from './client';

const API_URL = '/api/auth';

export const login = (credentials) => post(`${API_URL}/login`, credentials);

export const register = (userData) => post(`${API_URL}/register`, userData);
