import { get, post, put, del } from './client';

const API_URL = '/api/products';

export const getProducts = () => get(API_URL);

export const getProduct = (id) => get(`${API_URL}/${id}`);

export const createProduct = (data) => post(API_URL, data);

export const updateProduct = (id, data) => put(`${API_URL}/${id}`, data);

export const deleteProduct = (id) => del(`${API_URL}/${id}`);
