import request from '@/utils/request'

// 查询设备管理列表
export function listEquipment(query) {
  return request({
    url: '/bussiness/equipment/list',
    method: 'get',
    params: query
  })
}

// 查询设备管理详细
export function getEquipment(id) {
  return request({
    url: '/bussiness/equipment/' + id,
    method: 'get'
  })
}

// 新增设备管理
export function addEquipment(data) {
  return request({
    url: '/bussiness/equipment',
    method: 'post',
    data: data
  })
}

// 修改设备管理
export function updateEquipment(data) {
  debugger
  return request({
    url: '/bussiness/equipment',
    method: 'put',
    data: data
  })
}

// 删除设备管理
export function delEquipment(id) {
  return request({
    url: '/bussiness/equipment/' + id,
    method: 'delete'
  })
}



// 借用设备
export function useEquipment(id) {
  return request({
    url: '/bussiness/equipment/use/'+id,
    method: 'get',
    data: "{id:"+id+"}"
  })
}

//归还设备
export function backEquipment(id) {
  return request({
    url: '/bussiness/equipment/back/'+id,
    method: 'get',
    data: "{id:"+id+"}"
  })
}


// 获取储物柜列表
export function LockersList() {
  let id="1";
  return request({
    url: '/bussiness/repair/lockersList/'+id,
    method: 'get',
    data: "{id:"+id+"}"
  })
}
