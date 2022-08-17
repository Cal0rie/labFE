import request from '@/utils/request'

// 查询行政区域列表
export function listDept (query) {
  return request({
    url: '/system/dept/list',
    method: 'get',
    params: query
  })
}

// 查询行政区域列表-tree
export function treelist (query) {
  return request({
    url: '/system/dept/treelist',
    method: 'get',
    params: query
  })
}

// 查询行政区域列表-tree
export function treeuserlist (query) {
  return request({
    url: '/system/dept/treelistuser',
    method: 'get',
    params: query
  })
}

// 查询行政区域列表（排除节点）
export function listDeptExcludeChild (deptId) {
  return request({
    url: '/system/dept/list/exclude/' + deptId,
    method: 'get'
  })
}

// 查询行政区域详细
export function getDept (deptId) {
  return request({
    url: '/system/dept/' + deptId,
    method: 'get'
  })
}

// 查询行政区域下拉树结构
export function treeselect () {
  return request({
    url: '/system/dept/treeselect',
    method: 'get'
  })
}

// 根据角色ID查询行政区域树结构
export function roleDeptTreeselect (roleId) {
  return request({
    url: '/system/dept/roleDeptTreeselect/' + roleId,
    method: 'get'
  })
}

// 新增行政区域
export function addDept (data) {
  return request({
    url: '/system/dept',
    method: 'post',
    data: data
  })
}

// 修改行政区域
export function updateDept (data) {
  return request({
    url: '/system/dept',
    method: 'put',
    data: data
  })
}

// 删除行政区域
export function delDept (deptId) {
  return request({
    url: '/system/dept/' + deptId,
    method: 'delete'
  })
}
