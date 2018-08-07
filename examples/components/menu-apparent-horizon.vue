<template>
    <div class="contain">
        <input type="range" min="-50" max="50" 
          v-model="value"
          @input="change"/>
    </div>
</template>
<script>
import EventHub from "../../src/eventHub";
export default {
  data() {
    return {
      value : 0
    };
  },
  methods: {
    change() {
      EventHub.$emit("setapparenthorizon", this.value);
    }
  }
};
</script>
<style lang="scss" scoped>
.contain{
    background: rgba(0, 0, 0, 0.6);
    padding: 10px 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
}
</style>

