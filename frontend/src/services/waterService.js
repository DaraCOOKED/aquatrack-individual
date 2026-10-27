import api from './api'

export const waterService = {
  dashboard: () => api.get('/api/dashboard').then((r) => r.data.data),
  list: (params) => api.get('/api/water-intakes', { params }).then((r) => r.data),
  create: (data) => api.post('/api/water-intakes', data).then((r) => r.data.data),
  update: (id, data) => api.patch(`/api/water-intakes/${id}`, data).then((r) => r.data.data),
  remove: (id) => api.delete(`/api/water-intakes/${id}`).then((r) => r.data),
  weekly: (end_date) => api.get('/api/statistics/weekly', { params: { end_date } }).then((r) => r.data.data),
  monthly: (month) => api.get('/api/statistics/monthly', { params: { month } }).then((r) => r.data.data),
  getSettings: () => api.get('/api/settings').then((r) => r.data.data),
  updateSettings: (data) => api.patch('/api/settings', data).then((r) => r.data),
}
