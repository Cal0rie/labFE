import request from '@/utils/request'

// 查询字典
export function getDictData (dictName) {
  return request({
    url: '/system/dict/data/type/' + dictName,
    method: 'get'
  })
}

// 查询 自定义 属性
export function getCustomizelist (query) {
  return request({
    url: '/basic/config/list',
    method: 'get',
    params: query
  })
}

// 应用 自定义 属性
export function applyCustomizelist (query) {
  return request({
    url: '/basic/config/apply',
    method: 'post',
    data: query
  })
}
