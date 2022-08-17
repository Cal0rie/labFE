import request from '@/utils/request'

// 查询巡检管理列表
export function listPatrol(query) {
  return request({
    url: '/bussiness/patrol/list',
    method: 'get',
    params: query
  })
}

// 查询巡检管理详细
export function getPatrol(id) {
  return request({
    url: '/bussiness/patrol/' + id,
    method: 'get'
  })
}

// 新增巡检管理
export function addPatrol(data) {
  return request({
    url: '/bussiness/patrol',
    method: 'post',
    data: data
  })
}

// 修改巡检管理
export function updatePatrol(data) {
  return request({
    url: '/bussiness/patrol',
    method: 'put',
    data: data
  })
}

// 删除巡检管理
export function delPatrol(id) {
  return request({
    url: '/bussiness/patrol/' + id,
    method: 'delete'
  })
}
