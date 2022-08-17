import request from '@/utils/request'

// 查询banner信息链接管理列表
export function listManage(query) {
  return request({
    url: '/fangwu/manage/list',
    method: 'get',
    params: query
  })
}

// 查询banner信息链接管理详细
export function getManage(id) {
  return request({
    url: '/fangwu/manage/' + id,
    method: 'get'
  })
}

// 新增banner信息链接管理
export function addManage(data) {
  return request({
    url: '/fangwu/manage',
    method: 'post',
    data: data
  })
}

// 修改banner信息链接管理
export function updateManage(data) {
  return request({
    url: '/fangwu/manage',
    method: 'put',
    data: data
  })
}

// 删除banner信息链接管理
export function delManage(id) {
  return request({
    url: '/fangwu/manage/' + id,
    method: 'delete'
  })
}
