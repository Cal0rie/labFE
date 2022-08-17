import request from '@/utils/request'

// 查询核酸节点管理列表
export function listNucleicAcidNode(query) {
  return request({
    url: '/system/nucleicAcidNode/list',
    method: 'get',
    params: query
  })
}

// 查询核酸节点管理详细
export function getNucleicAcidNode(id) {
  return request({
    url: '/system/nucleicAcidNode/' + id,
    method: 'get'
  })
}

// 新增核酸节点管理
export function addNucleicAcidNode(data) {
  return request({
    url: '/system/nucleicAcidNode',
    method: 'post',
    data: data
  })
}

// 修改核酸节点管理
export function updateNucleicAcidNode(data) {
  return request({
    url: '/system/nucleicAcidNode',
    method: 'put',
    data: data
  })
}

// 删除核酸节点管理
export function delNucleicAcidNode(id) {
  return request({
    url: '/system/nucleicAcidNode/' + id,
    method: 'delete'
  })
}
// 启用
export function nucleicAcidNodeEnable(id) {
  return request({
    url: '/system/nucleicAcidNode/enable/' + id,
    method: 'put'
  })
}
// 禁用
export function nucleicAcidNodeDisabled(id) {
  return request({
    url: '/system/nucleicAcidNode/disabled/' + id,
    method: 'put'
  })
}

