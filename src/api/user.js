import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/api/account/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/api/account/info',
    method: 'get',
    params: { token },
    headers: { token: token }
  })
}

export function logout() {
  return request({
    url: '/api/account/logout',
    method: 'post'
  })
}

export function userRegister(data) {
  return request({
    url: '/api/account/register',
    method: 'post',
    data
  })
}

export function getUserList(data) {
  return request({
    url: '/api/user/list',
    method: 'post',
    data
  })
}
