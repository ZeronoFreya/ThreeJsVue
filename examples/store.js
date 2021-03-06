import Vue from "vue";
import Vuex from "vuex";
import {
    Vector3
} from "three";

Vue.use(Vuex);

const state = {
    loading: true,
    control: "orbit",
    facedPlane: "",
    rateApparentHorizon: 0.0, // 视平线的比率（-100% ~ 100%）
    camera: {
        lookat: new Vector3(),
        pos: new Vector3(),
        up: new Vector3(0, 1, 0)
    },
    rme: null // renderer & material & effect
};

const mutations = {
    toggleLoading: (state, status) => {
        status = status === undefined ? !state.loading : status;
        state.loading = status;
    },
    switchCtrl: (state, c = null) => {
        if (!c) {
            c = state.control == "orbit" ? "trackball" : "orbit";
        } else {
            c = c !== "orbit" ? (c !== "trackball" ? "orbit" : c) : c;
        }
        state.control = c;
    },
    setFacedPlane: (state, v = "") => {
        // if (~["front", "right", "top", "back"].indexOf(v)) {
        //     state.facedPlane = v;
        // }
        state.facedPlane = v;
    },
    setRME: (state, mtl) => {
        state.rme = mtl;
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