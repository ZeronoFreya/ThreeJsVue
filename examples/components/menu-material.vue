<template>
    <div class="contain">
      <button type="button" 
        v-for="mtl in mtls" class="item"
        @click.prevent.stop="switchMtl(mtl.action)">{{ mtl.text }}</button>
    </div>
</template>
<script>
import { wire } from "../static/material/wire.js";
import { advToon } from "../static/material/adv-toon.js";
import { envmapsHdr } from "../static/material/envmaps-hdr.js";
import { mapMutations } from "vuex";

export default {
    data() {
        return {
            mtls: [
                {
                    text: "wire",
                    action: wire
                },
                {
                    text: "advToon",
                    action: advToon
                },
                {
                    text: "envmapsHdr",
                    action: envmapsHdr
                }
            ]
        };
    },
    created() {},
    methods: {
        switchMtl(action) {
            // this.toggleLoading();
            let { material, rendererOpt } = { ...action() };
            this.setMaterial(material);
            this.setRenderer(rendererOpt);
            this.$emit("closeMenu");
        },
        ...mapMutations(["toggleLoading", "setMaterial","setRenderer"])
    }
};
</script>
<style lang="scss" scoped>
.contain {
    background: rgba(0, 0, 0, 0.6);
    padding: 10px 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
}
.item {
    height: 60px;
    line-height: 60px;
    color: white;
    font-size: 20px;
    white-space: nowrap;
    overflow: hidden;
}
</style>


