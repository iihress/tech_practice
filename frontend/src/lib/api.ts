import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const skipAuthUrls = ['/auth/login', '/auth/register']
  const isSkipUrl = skipAuthUrls.some(url => config.url?.includes(url))
  
  if (!isSkipUrl) {
    const token = localStorage.getItem('vh_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('vh_token')
      localStorage.removeItem('vh_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

export default api
