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
  LIST: 'ads/home',
  SELF_LIST_WITH_PAGINATION: (page: number, pageSize: number) =>
    genParamUrl('ads/get', { page_number: page, size: pageSize }),
  ADINFO_BY_ADID: (adId: any) => genParamUrl('ads/user/get', { ad_id: adId }),
  LIST_WITH_PAGINATION: (page: number, pageSize: number) =>
    genParamUrl('ads/index/get', { page_number: page, size: pageSize }),
  SEARCH_KEYWORD_WITH_PAGINATION: (keyword: string, page: number, pageSize: number) =>
    genParamUrl('ads/search', { Key: keyword, page_number: page, size: pageSize }),
  SAVE: 'ads/save',
  UPDATE: 'ads/update',
  DELETE: (adId: any) => genParamUrl('ads/delete', { ad_id: adId })
}

export const UserAPI = {
  LIST_WITH_PAGINATION: (page: number, pageSize: number) =>
    genParamUrl('board/root', { page_number: page, size: pageSize }),
  INFO_SELF: 'board/home',
  INFO_BY_USERNAME: (username: string) => genParamUrl('board/home', { username: username }),
  UPDATE_INFO: 'board/update',
  UPDATE_PWD: 'board/update/password',
  UPDATE_ROLE: (newRole: string, username: string) =>
    genParamUrl('board/root/manage', { roleChanged: newRole, username: username }),
  RESET_PWD: (username: string) => genParamUrl('board/root/resetPassword', { username: username }),
  LOGIN: 'board/login',
  REGISTER: 'board/register',
  DELETE_SELF: 'board/delete',
  DELETE_BY_USERNAME: (username: string) => genParamUrl('board/root/delete', { username: username })
}

export const ImageAPI = {
  GET_BY_ID: (imageId: any) => genParamUrl('picture/get', { picture_id: imageId }),
  FIRST_BY_AD: (adId: any) => genParamUrl('picture/get/first', { ad_id: adId }),
  LIST_BY_AD: (adId: any) => genParamUrl('picture/list', { ad_id: adId }),
  SAVE: 'picture/save',
  UPDATE: 'picture/update',
  DELETE: (imageId: any) => genParamUrl('picture/delete', { picture_id: imageId })
}
