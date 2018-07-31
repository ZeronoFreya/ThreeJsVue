<template>
    <model-obj
        @on-load="onLoad" 
        :src="src"></model-obj>
</template>
<script>
import ModelObj from "../../src/model-obj.vue";

export default {
  name: "demo-obj",
  data() {
    return {
      src:{
        base:'static/models/obj',
        mtls:'',
        objs:[{
          obj:'body.obj'
        },{
          obj:'opai.obj'
        }]
      }
    };
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