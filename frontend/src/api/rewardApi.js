import { get } from './client';

const API_URL = '/api/rewards';

export const getRewards = () => get(API_URL);
