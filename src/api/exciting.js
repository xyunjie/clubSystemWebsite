import request from '@/utils/request'

export function getExcitingMomentsList(data) {
  return request({
    url: '/api/exciting/list?',
    method: 'get',
    params: data
  })
}

export function saveExcitingMoments(data) {
  return request({
    url: '/api/exciting/save',
    method: 'post',
    data
  })
}

export function removeExcitingMoments(data) {
  return request({
    url: '/api/exciting/remove',
    method: 'delete',
    params: data
  })
}
