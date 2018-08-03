<template>
    <ul class="expanded_panel">
        <li v-for="mtl in mtls"
            @click.prevent.stop="switchMtl(mtl.action())">{{ mtl.text }}</li>
    </ul>
</template>
<script>
import EventHub from '../../src/eventHub';
import { wire } from "../static/material/wire.js";
import { advToon } from "../static/material/adv-toon.js";
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
        }
      ]
    }
  },
  methods:{
    switchMtl(mtl) {
      EventHub.$emit('emitevent', mtl);
      this.$emit('closeMenu');
    }
  }
};
</script>
<style scoped>
.expanded_panel {
  background: rgba(0, 0, 0, 0.6);
  padding: 10px 0;
}
</style>


