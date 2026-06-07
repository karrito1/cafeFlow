const API_URL = '/api/customers';

export const getCustomers = async () => {
  const res = await fetch(API_URL);
  return res.json();
};

export const getCustomer = async (id) => {
  const res = await fetch(`${API_URL}/${id}`);
  return res.json();
};
