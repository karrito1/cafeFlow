import { get, post, put, del } from './client';

const API_URL = '/api/categories';

export const getCategories = () => get(API_URL);
export const getCategory = (id) => get(`${API_URL}/${id}`);
export const createCategory = (data) => post(API_URL, data);
export const updateCategory = (id, data) => put(`${API_URL}/${id}`, data);
export const deleteCategory = (id) => del(`${API_URL}/${id}`);
