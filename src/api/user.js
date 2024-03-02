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

export function modifyUserStatus(data) {
  return request({
    url: '/api/user/status',
    method: 'post',
    data
  })
}

export function removeUser(data) {
  return request({
    url: '/api/user/remove',
    method: 'delete',
    params: data
  })
}

export function modifyUserRole(data) {
  return request({
    url: '/api/user/modifyRole',
    method: 'post',
    data
  })
}

export function getClubUser(data) {
  return request({
    url: '/api/club/getUser',
    method: 'post',
    data
  })
}

export function updateInfo(data) {
  return request({
    url: '/api/account/update',
    method: 'post',
    data
  })
}

export function changePassword(data) {
  return request({
    url: '/api/account/changePassword',
    method: 'post',
    data
  })
}
