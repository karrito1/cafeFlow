const API_URL = '/api/orders';

export const getOrders = async () => {
  const res = await fetch(API_URL);
  return res.json();
};

export const getOrder = async (id) => {
  const res = await fetch(`${API_URL}/${id}`);
  return res.json();
};

export const createOrder = async (data) => {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const updateOrderStatus = async (id, status) => {
  const res = await fetch(`${API_URL}/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  return res.json();
};
