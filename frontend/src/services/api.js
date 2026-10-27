import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  withCredentials: true,
  withXSRFToken: true,
  headers: { Accept: 'application/json' },
})

export const csrf = () => api.get('/sanctum/csrf-cookie')

export const errorMessage = (error, fallback = 'Something went wrong. Please try again.') => {
  const errors = error.response?.data?.errors
  if (errors) return Object.values(errors).flat()[0]
  return error.response?.data?.message || fallback
}

export default api
