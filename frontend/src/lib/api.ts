import axios from 'axios'

const API_URL = 'http://localhost:3000/api'

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Intercepteur requête : attache le token JWT automatiquement
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Intercepteur réponse : redirige vers /login si token expiré
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      sessionStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Fonctions utilitaires
export const createPlumber = async (data: any) => {
  return api.post('/plumbers', data)
}

export const getMe = async () => {
  return api.get('/auth/me')
}

export const isAuthenticated = (): boolean => {
  return !!(localStorage.getItem('token') || sessionStorage.getItem('token'))
}

export const logout = () => {
  localStorage.removeItem('token')
  sessionStorage.removeItem('token')
  window.location.href = '/login'
}