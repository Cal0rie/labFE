import request from '@/utils/request'

//管控规则 查询参数列表
export function listControl(query) {
  return request({
    url: '/control/rule/list',
    method: 'get',
    params: query
  })
}

//管控规则 查询参数详细
export function getControl(id) {
  return request({
    url: '/control/rule/' + id,
    method: 'get'
  })
}

//管控规则  新增
export function addControl(data) {
  return request({
    url: '/control/rule',
    method: 'post',
    data: data
  })
}

//管控规则  修改
export function updateControl(data) {
  return request({
    url: '/control/rule',
    method: 'put',
    data: data
  })
}

// 删除参数配置
export function delConfig(id) {
  return request({
    url: '/control/rule/' + id,
    method: 'delete'
  })
}
// 查询核算节点 下拉列表数据
export function getControlRuleUseList() {
  return request({
    url: '/system/nucleicAcidNode/controlRuleUseList',
    method: 'get'
  })
}

// 启用
export function controlEnable(id) {
  return request({
    url: '/control/rule/enabled/' + id,
    method: 'put'
  })
}

// 禁用
export function controlDisabled(id) {
  return request({
    url: '/control/rule/disabled/' + id,
    method: 'put'
  })
}
