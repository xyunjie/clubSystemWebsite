import request from '@/utils/request'

// 上传文件
export function uploadFile(data) {
  return request({
    url: '/api/public/upload',
    method: 'post',
    data
  })
}
