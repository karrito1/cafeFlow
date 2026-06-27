import { get, post } from './client';

const API_URL = '/api/payments';

export const getPayments = () => get(API_URL);

export const createPayment = (data) => post(API_URL, data);
