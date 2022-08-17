import request from '@/utils/request'

// 获取各年龄段人员接种情况
export function vaccinationreportAgeInfo (query) {
  return request({
    url: '/vaccinationreport/age-info',
    method: 'get',
    params: query
  })
}

// 获取疫苗接种基本信息
export function vaccinationreportBaseInfo (query) {
  return request({
    url: '/vaccinationreport/base-info',
    method: 'get',
    params: query
  })
}

// 获取加强针接种人员数量
export function vaccinationreportBoosterInfo (query) {
  return request({
    url: '/vaccinationreport/booster-info',
    method: 'get',
    params: query
  })
}

// 获取加强针接种人员数量
export function vaccinationreportOldInfo (query) {
  return request({
    url: '/vaccinationreport/old-info',
    method: 'get',
    params: query
  })
}

// 获取日接种人员数量
export function vaccinationreportDailyInfo (query) {
  return request({
    url: '/vaccinationreport/daily-info',
    method: 'get',
    params: query
  })
}

// 获取各村居加强免疫接种情况
export function vaccinationreportVillageInfo (query) {
  return request({
    url: '/vaccinationreport/village-info',
    method: 'get',
    params: query
  })
}

//获取后台初始统计数据
export function initDataSel() {
  return request({
    url: '/initDataSel',
    method: 'get'
  })
}

// 查询最近借用设备列表
export function Equipmentlist(query) {
  return request({
    url: '/bussiness/equipment/Equipmentlist',
    method: 'get',
    params: query
  })
}