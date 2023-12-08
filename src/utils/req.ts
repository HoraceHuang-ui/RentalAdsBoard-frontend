import axios from 'axios'

const instance = axios.create({
  baseURL: '/api',
  timeout: 20000
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

export const ApiPost = async (path: string, data?: object) => {
  return await instance.post(path, data)
}

export const ApiDelete = async (path: string) => {
  return await instance.delete(path)
}

export const ApiPut = async (path: string, data?: object) => {
  return await instance.put(path, data)
}

const genParamUrl = (url: string, params?: object) => {
  let path = url
  if (params) {
    path += '?'
  } else {
    return path
  }
  for (const key of Object.keys(params)) {
    path += `${key}=${params[key]}&`
  }
  return path.substring(0, path.length - 1)
}

export const AdsAPI = {
  SELF_LIST_BY_PAGINATION: (page: number, pageSize: number) =>
    genParamUrl('ads/list/self', { page_number: page, size: pageSize }),
  ADINFO_BY_ADID: (adId: any) => genParamUrl('ads/get', { ad_id: adId }),
  LIST_BY_PAGINATION: (page: number, pageSize: number) =>
    genParamUrl('ads/list', { page_number: page, size: pageSize }),
  SAVE: 'ads/save',
  UPDATE: 'ads/update',
  DELETE: (adId: any) => genParamUrl('ads/delete', { ad_id: adId })
}

export const UserAPI = {
  LIST_BY_PAGINATION: (page: number, pageSize: number) =>
    genParamUrl('user/list', { page_number: page, size: pageSize }),
  INFO_SELF: 'user/get',
  INFO_BY_USERNAME: (username: string) => genParamUrl('user/get', { username: username }),
  UPDATE_INFO: 'user/update/info',
  UPDATE_PWD: 'user/update/password',
  UPDATE_ROLE: (newRole: string, username: string) =>
    genParamUrl('user/admin/role', { roleChanged: newRole, username: username }),
  RESET_PWD: (username: string) => genParamUrl('user/admin/resetPassword', { username: username }),
  DELETE_BY_USERNAME: (username: string) =>
    genParamUrl('user/admin/delete', { username: username }),
  LOGIN: 'user/login',
  REGISTER: 'user/register',
  DELETE_SELF: 'user/delete'
}

export const ImageAPI = {
  GET_BY_ID: (imageId: any) => genParamUrl('image/get', { image_id: imageId }),
  FIRST_BY_AD: (adId: any) => genParamUrl('image/ad/first', { ad_id: adId }),
  LIST_BY_AD: (adId: any) => genParamUrl('image/ad/list', { ad_id: adId }),
  SAVE: 'image/save',
  UPDATE: 'image/update',
  DELETE: (imageId: any) => genParamUrl('image/delete', { image_id: imageId })
}
