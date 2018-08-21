<template>
    <model-obj
        :backgroundAlpha="bgAlpha"
        @on-load="onLoad" 
        :src="src"></model-obj>
</template>
<script>
import ModelObj from "../../src/model-obj.vue";

export default {
  name: "view-layer",
  data() {
    return {
      bgAlpha: 0,
      src: {
        base: "static/models/obj",
        mtls: "",
        objs: ["body.obj", "opai.obj", "chikubi.obj"]
      }
    };
  },
  methods: {
    onLoad() {
      this.$emit("on-load");
    }
  },
  components: {
    ModelObj
  }
};
</script>