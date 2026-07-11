import { post } from './client';

const API_URL = '/api/auth';

export const login = (credentials) => post(`${API_URL}/login`, credentials);

export const loginCustomer = (credentials) => post(`${API_URL}/login-customer`, credentials);

export const register = (userData) => post(`${API_URL}/register`, userData);

export const forgotPassword = (email) => post(`${API_URL}/forgot-password`, { email });

export const resetPassword = (token, password) => post(`${API_URL}/reset-password/${token}`, { password });
