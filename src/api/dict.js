import request from '@/utils/request'

export function getDictList(data) {
  return request({
    url: '/api/dict/list',
    method: 'get',
    params: data
  })
}
export function getDictListByGrade(data) {
  return request({
    url: '/api/dict/listByGrade',
    method: 'get',
    params: data
  })
}
export function saveDict(data) {
  return request({
    url: '/api/dict/saveOrUpdate',
    method: 'post',
    data
  })
}

export function removeDict(data) {
  return request({
    url: '/api/dict/remove',
    method: 'delete',
    params: data
  })
}
