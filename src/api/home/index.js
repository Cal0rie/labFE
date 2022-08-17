import request from '@/utils/request'

// 全镇风险人员数据|风险人员管控类型统计
export function streetRisk (id) {
  return request({
    url: '/control/streetRisk',
    method: 'get',
    id
  })
}
// 全镇风险人员数据|风险人员管控类型统计
export function mapRisk (id) {
  return request({
    url: 'control/mapRisk',
    method: 'get',
    id
  })
}
// 近10日派单数量趋势 dispatchTrend/
export function dispatchTrend (id) {
  return request({
    url: 'control/homeTrend',
    method: 'get',
    id
  })
}
// 近10日派单数量趋势
export function village (id) {
  return request({
    url: 'control/village',
    method: 'get',
    id
  })
}
// 获取公告
export function notice (id) {
  return request({
    url: 'system/notice/' + id,
    method: 'get',
  })
}

// // ***********
// export function addPopulation(data) {
//   return request({
//     url: '/population/population',
//     method: 'post',
//     data: data
//   })
// }
