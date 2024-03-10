import request from '@/utils/request'

export function getClubList(data) {
  return request({
    url: '/api/club/list',
    method: 'post',
    data
  })
}

export function saveOrUpdateClub(data) {
  return request({
    url: '/api/club/save',
    method: 'post',
    data
  })
}

export function modifyClubStatus(data) {
  return request({
    url: '/api/club/status',
    method: 'post',
    data
  })
}

export function removeClub(data) {
  return request({
    url: '/api/club/remove',
    method: 'delete',
    params: data
  })
}

export function getClubBalance(data) {
  return request({
    url: '/api/club/balance',
    method: 'post',
    data
  })
}

export function removeClubUser(data) {
  return request({
    url: '/api/clubUser/remove',
    method: 'post',
    data
  })
}

export function getAllClub() {
  return request({
    url: '/api/club/all',
    method: 'get'
  })
}

export function getMyClub(data) {
  return request({
    url: '/api/club/myClub',
    method: 'post',
    data
  })
}

export function getHotClub() {
  return request({
    url: '/api/club/hot',
    method: 'get'
  })
}
export function getClubDetail(data) {
  return request({
    url: '/api/club/detail',
    method: 'get',
    params: data
  })
}

export function userJoinClub(data) {
  return request({
    url: '/api/clubUser/join',
    method: 'post',
    data
  })
}

export function handleUserJoinClub(data) {
  return request({
    url: '/api/clubUser/handler',
    method: 'post',
    data
  })
}

export function getClubBalanceList(data) {
  return request({
    url: '/api/balance/list',
    method: 'post',
    data
  })
}

export function saveClubBalance(data) {
  return request({
    url: '/api/balance/save',
    method: 'post',
    data
  })
}

export function getMyClubUser(data) {
  return request({
    url: '/api/club/getMyClubUser',
    method: 'post',
    data
  })
}
