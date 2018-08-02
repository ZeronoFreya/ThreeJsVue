<template>
    <ul class="expanded_panel">
        <li v-for="mtl in mtls"
            @click.prevent.stop="switchMtl(mtl.mtl)">{{ mtl.text }}</li>
    </ul>
</template>
<script>
export default {
  data() {
    return {
      mtls: [
        {
          text: "standard",
          mtl: "standard"
        },
        {
          text: "wire",
          mtl: "wire"
        }
      ]
    }
  },
  methods:{
    switchMtl(mtl) {
      console.log(mtl);
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


