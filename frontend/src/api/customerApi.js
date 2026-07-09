import { get, post, del } from './client';

const API_URL = '/api/customers';

export const getCustomers = () => get(API_URL);

export const getCustomer = (id) => get(`${API_URL}/${id}`);

export const registerCustomer = (data) => post(API_URL, data);

export const deleteCustomer = (id) => del(`${API_URL}/${id}`);
