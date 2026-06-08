const API_URL = '/api/payments';

export const getPayments = async () => {
  const res = await fetch(API_URL);
  return res.json();
};

export const createPayment = async (data) => {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
};
