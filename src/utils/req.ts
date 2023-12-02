import axios from 'axios'

const instance = axios.create({
  baseURL: '/api',
  timeout: 10000
})

instance.interceptors.request.use((config) => {
  config.headers['authorization'] = localStorage.getItem('token')
  return config
})

instance.interceptors.response.use(
  (resp) => {
    if (resp.data && resp.data.stateCode === 200) {
      return resp
    } else {
      console.error(resp.data.message)
      return Promise.reject(resp)
    }
  },
  (err) => {
    return Promise.reject(err)
  }
)

export const ApiGet = async (path: string) => {
  return await instance.get(path)
}

export const ApiPost = async (path: string, data: object) => {
  return await instance.post(path, data)
}

export const ApiDelete = async (path: string) => {
  return await instance.delete(path)
}
