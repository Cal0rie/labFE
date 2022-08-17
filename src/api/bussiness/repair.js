import request from '@/utils/request'

// 查询报修管理列表
export function listRepair(query) {
  return request({
    url: '/bussiness/repair/list',
    method: 'get',
    params: query
  })
}

// 查询报修管理详细
export function getRepair(id) {
  return request({
    url: '/bussiness/repair/' + id,
    method: 'get'
  })
}

// 新增报修管理
export function addRepair(data) {
  return request({
    url: '/bussiness/repair',
    method: 'post',
    data: data
  })
}

// 修改报修管理
export function updateRepair(data) {
  return request({
    url: '/bussiness/repair',
    method: 'put',
    data: data
  })
}

// 删除报修管理
export function delRepair(id) {
  return request({
    url: '/bussiness/repair/' + id,
    method: 'delete'
  })
}


// 获取设备列表
export function getEquipmentlist() {
  let id="1";
  return request({
    url: '/bussiness/repair/getEquipmentlist/'+id,
    method: 'get',
    data: "{id:"+id+"}"
  })
}
