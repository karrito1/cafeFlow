import { get, post } from './client';

const API_URL = '/api/rewards';

export const getRewards = () => get(API_URL);

export const claimReward = (customerId, rewardId) => post(`${API_URL}/claim`, { customerId, rewardId });
