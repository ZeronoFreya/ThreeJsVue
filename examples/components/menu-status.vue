<template>
    <div class="contain">
        <button type="button" class="status-btn"
            v-for="(btn, index) in btns"
            @click.prevent.stop="runAction(btn.action)">{{btn.text}}</button>
    </div>
</template>
<script>
import { toggleFullscreen } from "../utils/fullScreen";
import { mapMutations } from 'vuex';
export default {
  data() {
    return {
      btns: [
        {
          text: "Full Screen",
          action: this.fullScreen
        },
        {
          text: "Auto Rotate",
          action: this.autoRotate
        },
        {
          text: "Rotate Y",
          action: this.switchCtrl
        },
      ]
    }
  },
  methods: {
    runAction(act){
        act();
        this.$emit('closeMenu');
    },
    fullScreen() {
      toggleFullscreen();
    },
    autoRotate() {
      console.log("autoRotate");
    },
    // this.$store.commit('switchCtrl')
    ...mapMutations([
      'switchCtrl'
    ])
  }
};
</script>
<style lang="scss" scoped>
.contain{
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex-wrap: wrap;
    height: auto;
}
.status-btn{
    // width: 100px;
    height: 60px;
    color: white;
    font-size: 20px;
    // border: 1px #ccc solid;
    // border-radius: 6px;
    white-space: nowrap;
    // margin: 0 10px;
    overflow: hidden;
}
</style>

