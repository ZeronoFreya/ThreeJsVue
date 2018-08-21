import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const state = {
    control: "orbit",
    viewPoint: "front",
    rateApparentHorizon: 0.0 // 视平线的比率（-100% ~ 100%）
};

const mutations = {
    switchCtrl: (state, c = null) => {
        if (!c) {
            c = state.control == "orbit" ? "trackball" : "orbit";
        } else {
            c = c !== "orbit" ? (c !== "trackball" ? "orbit" : c) : c;
        }
        state.control = c;
    },
    setViewPoint: (state, v = "front") => {
        if (~["front", "right", "top", "free", "back"].indexOf(v)) {
            state.viewPoint = v;
        }
    },
    setRateApparentHorizon: (state, v) => {
        state.rateApparentHorizon = parseFloat(v);
    }
};

export default new Vuex.Store({
    state,
    mutations
});
