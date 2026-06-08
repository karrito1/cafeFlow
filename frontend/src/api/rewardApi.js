const API_URL = '/api/rewards';

export const getRewards = async () => {
  const res = await fetch(API_URL);
  return res.json();
};

export const claimReward = async (customerId, rewardId) => {
  const res = await fetch(`${API_URL}/claim`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ customerId, rewardId }),
  });
  return res.json();
};
