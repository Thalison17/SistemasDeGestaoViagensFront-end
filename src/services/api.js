import axios from 'axios'

const api = axios.create({
  baseURL: 'https://localhost:7068/',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Adicione interceptors para debug
api.interceptors.request.use(request => {
  console.log('Request:', request)
  return request
})

api.interceptors.response.use(
  response => {
    console.log('Response:', response)
    return response
  },
  error => {
    console.error('API Error:', error)
    return Promise.reject(error)
  }
)

export default api
