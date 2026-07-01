import { get, post, put, del } from './client';

const API_URL = '/api/users';

export const getUsers = () => get(API_URL);

export const createUser = (data) => post(API_URL, data);

export const updateUser = (id, data) => put(`${API_URL}/${id}`, data);

export const deleteUser = (id) => del(`${API_URL}/${id}`);
