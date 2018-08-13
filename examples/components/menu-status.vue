<template>
    <div class="contain">
        <button type="button" class="status-btn"
            v-for="(btn, index) in btns"
            @click.prevent.stop="runAction(btn.action)">{{btn.text}}</button>
    </div>
</template>
<script>
import { toggleFullscreen } from "../utils/fullScreen";
import EventHub from "../../src/eventHub";
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
          action: this.rotateY
        },
      ]
    };
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
    rotateY() {
      if(EventHub.controls.rotateY){
        EventHub.controls.rotateY = false;
      }else{
        EventHub.controls.rotateY = true;
      }
    },
  }
};
</script>
<style lang="scss" scoped>
.contain{
    display: flex;
    justify-content: space-around;
    align-items: center;
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

