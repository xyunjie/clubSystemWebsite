import request from '@/utils/request'

export function getSystemInfo(params) {
  return request({
    url: '/api/system/info',
    method: 'get',
    params
  })
}

export function saveSystemInfo(data) {
  return request({
    url: '/api/system/save',
    method: 'post',
    data
  })
}

export function getSystemNoticeList(data) {
  return request({
    url: '/api/system/notice',
    method: 'post',
    data
  })
}
