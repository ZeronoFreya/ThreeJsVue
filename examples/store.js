import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  control: 'orbit',
  viewPoint: 'front'
}

const mutations = {
  switchCtrl: (state, c=undefined) => {
    if (!c) {
      c = state.control === 'orbit' ? 'trackball' : 'orbit'
    }else {
      c = c !== 'orbit' ? c !== 'trackball' ? 'orbit' : c : c
    }
    state.control = c
  },
  setViewPoint: (state, v = 'front') => {
    if (~['front', 'right', 'top', 'back'].indexOf(v)) {
      state.viewPoint = v
    }
  }
}

export default new Vuex.Store({
  state,
  mutations
})
