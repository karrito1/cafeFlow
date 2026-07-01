import { get, post, put } from './client';

const API_URL = '/api/orders';

export const getOrders = () => get(API_URL);

export const getOrder = (id) => get(`${API_URL}/${id}`);

export const createOrder = (data) => post(API_URL, data);

export const updateOrder = (id, data) => put(`${API_URL}/${id}`, data);
