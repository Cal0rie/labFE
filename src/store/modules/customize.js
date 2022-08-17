import Vue from 'vue'

const state = {
  totalDicts: {}
}

const mutations = {
  SET_DICTS_OPTION: (state, obj) => {
    for (var key in obj) {
      Vue.set(state.totalDicts, key, obj[key]);
    }
  }
}

const actions = {
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
