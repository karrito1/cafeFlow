const API_URL = '/api/tables';

export const getTables = async () => {
  const res = await fetch(API_URL);
  return res.json();
};

export const getTable = async (id) => {
  const res = await fetch(`${API_URL}/${id}`);
  return res.json();
};

export const createTable = async (data) => {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const updateTableStatus = async (id, status) => {
  const res = await fetch(`${API_URL}/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  return res.json();
};
