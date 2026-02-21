const TOKEN_KEY = 'donjon_jwt';

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

export function hasToken() {
  return !!getToken();
}

async function apiFetch(path, options = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`/api${path}`, { ...options, headers });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || `Erreur ${res.status}`);
  }
  return data;
}

// Auth
export const register = (pseudo, password, _hp = '') =>
  apiFetch('/auth/register', { method: 'POST', body: JSON.stringify({ pseudo, password, _hp }) });

export const login = (pseudo, password) =>
  apiFetch('/auth/login', { method: 'POST', body: JSON.stringify({ pseudo, password }) });

export const getMe = () => apiFetch('/auth/me');

// Players
export const getPlayers = () => apiFetch('/players');

export const getPlayer = (id) => apiFetch(`/players/${id}`);

// Save
export const putSave = (save_data) =>
  apiFetch('/save', { method: 'PUT', body: JSON.stringify({ save_data }) });
