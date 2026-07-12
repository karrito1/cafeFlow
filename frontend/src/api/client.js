const BASE_URL = import.meta.env.VITE_API_URL || '';

function getToken() {
  try {
    const stored = localStorage.getItem('user');
    if (!stored) return null;
    const user = JSON.parse(stored);
    return user?.token || null;
  } catch {
    return null;
  }
}

async function request(url, options = {}) {
  const token = getToken();
  const headers = { ...options.headers };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  if (options.body && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }
  const res = await fetch(BASE_URL + url, { ...options, headers });
  return res.json();
}

export const get = (url) => request(url);
export const post = (url, data) => request(url, { method: 'POST', body: JSON.stringify(data) });
export const put = (url, data) => request(url, { method: 'PUT', body: JSON.stringify(data) });
export const patch = (url, data) => request(url, { method: 'PATCH', body: JSON.stringify(data) });
export const del = (url) => request(url, { method: 'DELETE' });
