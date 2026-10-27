import api, { csrf } from './api'

export const authService = {
  async register(payload) {
    await csrf()
    return (await api.post('/api/register', payload)).data
  },
  async login(payload) {
    await csrf()
    return (await api.post('/api/login', payload)).data
  },
  async logout() {
    await csrf()
    return (await api.post('/api/logout')).data
  },
  async me() {
    return (await api.get('/api/me')).data.data
  },
}
