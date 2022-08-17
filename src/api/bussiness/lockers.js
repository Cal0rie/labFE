import request from '@/utils/request'

// 查询储物柜列表
export function listLockers(query) {
  debugger
  return request({
    url: '/bussiness/lockers/list',
    method: 'get',
    params: query
  })
}

// 查询储物柜详细
export function getLockers(id) {
  return request({
    url: '/bussiness/lockers/' + id,
    method: 'get'
  })
}

// 新增储物柜
export function addLockers(data) {
  return request({
    url: '/bussiness/lockers',
    method: 'post',
    data: data
  })
}

// 修改储物柜
export function updateLockers(data) {
  return request({
    url: '/bussiness/lockers',
    method: 'put',
    data: data
  })
}

// 删除设备管理
export function delLockers(id) {
  return request({
    url: '/bussiness/lockers/' + id,
    method: 'delete'
  })
}
