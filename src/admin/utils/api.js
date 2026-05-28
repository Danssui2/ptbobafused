const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const getToken = () => localStorage.getItem('ptboba_token')

const request = async (path, options = {}) => {
  const token = getToken()
  const headers = { 'Content-Type': 'application/json', ...options.headers }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers })
  const data = await res.json()

  if (!res.ok) {
    const err = new Error(data.message || 'Terjadi kesalahan.')
    err.status = res.status
    throw err
  }
  return data
}

export const api = {
  // Auth
  login: (username, password) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) }),
  me: () => request('/auth/me'),
  changePassword: (currentPassword, newPassword) =>
    request('/auth/change-password', { method: 'PUT', body: JSON.stringify({ currentPassword, newPassword }) }),
  getAdmins: () => request('/auth/admins'),
  createAdmin: (data) => request('/auth/admins', { method: 'POST', body: JSON.stringify(data) }),
  deleteAdmin: (id) => request(`/auth/admins/${id}`, { method: 'DELETE' }),

  // Content
  getAllContent: () => request('/content'),
  getSection: (section) => request(`/content/${section}`),
  updateSection: (section, data) =>
    request(`/content/${section}`, { method: 'PUT', body: JSON.stringify({ data }) }),
  getContentMeta: () => request('/content/meta/all'),
}
