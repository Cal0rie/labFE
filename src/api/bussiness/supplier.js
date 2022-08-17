import request from '@/utils/request'

// 查询采购管理列表
export function listSupplier(query) {
  return request({
    url: '/bussiness/supplier/list',
    method: 'get',
    params: query
  })
}

// 查询采购管理详细
export function getSupplier(id) {
  return request({
    url: '/bussiness/supplier/' + id,
    method: 'get'
  })
}

// 新增采购管理
export function addSupplier(data) {
  return request({
    url: '/bussiness/supplier',
    method: 'post',
    data: data
  })
}

// 修改采购管理
export function updateSupplier(data) {
  return request({
    url: '/bussiness/supplier',
    method: 'put',
    data: data
  })
}

// 删除采购管理
export function delSupplier(id) {
  return request({
    url: '/bussiness/supplier/' + id,
    method: 'delete'
  })
}
