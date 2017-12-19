import axios from 'axios'

// const url = process.env.NODE_ENV !== 'production' ? '/apis' : ''
// axios.defaults.baseURL = url

axios.interceptors.request.use((config) => {
  return config
}, (error) => {
  // 对请求错误做些什么
  return Promise.reject(error)
})

axios.interceptors.response.use((response) => {
  return response
})
