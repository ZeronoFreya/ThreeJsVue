<template>
    <div>
        <model-obj :backgroundAlpha="0"
            @on-load="onLoad" 
            src="../static/models/obj/tree.obj"></model-obj>
    </div>
</template>
<script>
import ModelObj from "../../src/model-obj.vue";

export default {
  name: "demo-obj",
  data() {
    return {};
  },
  methods: {
    onLoad() {
        this.$emit('on-load')
    }
  },
  components: {
    ModelObj
  }
};
</script>