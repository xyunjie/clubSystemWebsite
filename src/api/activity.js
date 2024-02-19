import request from '@/utils/request'

export function getActivityList(data) {
  return request({
    url: '/api/activity/list',
    method: 'post',
    data
  })
}

export function modifyActivityStatus(data) {
  return request({
    url: '/api/activity/status',
    method: 'post',
    data
  })
}

export function removeActivity(data) {
  return request({
    url: '/api/activity/remove',
    method: 'delete',
    params: data
  })
}
