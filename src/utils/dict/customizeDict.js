import store from './../../store'
import { getDictData } from '@/api/customize/customize'

const addDicts = (needArray, finishFn) => {
  if (!needArray || needArray === '') { return false };
  if (!Array.isArray(needArray)) { needArray = [needArray]; };
  const needFindDicts = [];
  unique(needArray).forEach((dictsName) => {
    if (!store.state.customize.totalDicts.hasOwnProperty(dictsName)) {
      needFindDicts.push(loadDictsData(dictsName));
    }
  })
  if (finishFn && typeof finishFn === "function") {
    Promise.all(needFindDicts).then(() => { finishFn() });
  }
}

const unique = (arr) => [...new Set(arr)];

const loadDictsData = (dictsName) => {
  return getDictData(dictsName).then(res => {
    if (res.code === 200) {
      store.commit('customize/SET_DICTS_OPTION', { [dictsName]: res.data });
    }
  })
}

export default addDicts
