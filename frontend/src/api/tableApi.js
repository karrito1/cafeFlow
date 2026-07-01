import { get, post, put, del } from './client';

const API_URL = '/api/tables';

export const getTables = () => get(API_URL);

export const getTable = (id) => get(`${API_URL}/${id}`);

export const createTable = (data) => post(API_URL, data);

export const updateTable = (id, data) => put(`${API_URL}/${id}`, data);

export const deleteTable = (id) => del(`${API_URL}/${id}`);
