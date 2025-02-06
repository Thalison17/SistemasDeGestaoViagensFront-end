import axios from 'axios'

const api = axios.create({
    baseURL: 'https://localhost:7068/'
    })

export default api
