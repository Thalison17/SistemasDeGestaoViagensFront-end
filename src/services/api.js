import axios from 'axios'

const api = axios.create({
    baseUrl: 'https://localhost:7068/'
    })

export default api