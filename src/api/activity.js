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

export function getActivityUserList(data) {
  return request({
    url: '/api/activity/user/list',
    method: 'post',
    data
  })
}

export function modifyActivityUserEntry(data) {
  return request({
    url: '/api/activity/entry/status',
    method: 'post',
    data
  })
}

export function removeActivityUserEntry(data) {
  return request({
    url: '/api/activity/entry/remove',
    method: 'delete',
    params: data
  })
}
