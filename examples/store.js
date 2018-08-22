import Vue from "vue";
import Vuex from "vuex";
import { Vector3 } from "three";

Vue.use(Vuex);

const state = {
    control: "orbit",
    facedPlane: "",
    rateApparentHorizon: 0.0, // 视平线的比率（-100% ~ 100%）
    camera: {
        lookat: new Vector3(),
        pos: new Vector3(),
        up: new Vector3(0, 1, 0)
    }
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
    lookThreeView: (state, v = "") => {
        // if (~["front", "right", "top", "back"].indexOf(v)) {
        //     state.facedPlane = v;
        // }
        state.facedPlane = v;
    },
    setViewPoint: (state, camera) => {
        state.camera = camera;
    },
    setRateApparentHorizon: (state, v) => {
        state.rateApparentHorizon = parseFloat(v);
    }
};

export default new Vuex.Store({
    state,
    mutations
});
