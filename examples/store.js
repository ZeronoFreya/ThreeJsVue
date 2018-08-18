import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  control: 'orbit'
}

const mutations = {
  switchCtrl: (state, c=undefined) => {
    if (!c) {
      c = state.control === 'orbit' ? 'trackball' : 'orbit'
    }else {
      c = c !== 'orbit' ? c !== 'trackball' ? 'orbit' : c : c
    }
    state.control = c
  }
}

export default new Vuex.Store({
  state,
  mutations
})
