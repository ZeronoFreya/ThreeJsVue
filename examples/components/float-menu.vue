<template>
  <div class="menu" :class="{'menu_expanded': showMenu}">
		<button type="button" class="menu_button" @click.prevent.stop="toggleMenu">Menu</button>
		<i class="lock_menu" @click.prevent.stop="lockMenu">{{isLockMenu ? 'T':'N'}}</i>
		<ul class="panel">
      <template v-for="(item, index) in items">
          <li class="action_list"
              :class="{'action_expanded': index == secActive || !item.text}"
              v-if="item.template">
              <div v-if="item.text" class="toggle"
                  @click.prevent.stop="toggleSecMenu(index, $event)">
                  <span class="action_name">{{ item.text }}</span>
              </div>
              <component @closeMenu="closeMenu" :is="item.template"></component>
          </li>
          <li class="action_list" v-else @click.prevent.stop="item.action">{{ item.text }}</li>
      </template>
      <li class="space"></li>
		</ul>
	</div>
</template>
<script>
import MenuMaterial from "./menu-material";
import MenuPerspective from "./menu-perspective";
import MenuStatus from "./menu-status";
import MenuApparentHorizon from "./menu-apparent-horizon";
// import {scroller} from 'vue-scrollto/src/scrollTo'
export default {
  data() {
    return {
      showMenu: false,
      isLockMenu: false,
      secActive:NaN,
      items: [
        {
          template: MenuStatus
        },
        {
          text: "Apparent Horizon",
          template: MenuApparentHorizon
        },
        {
          text: "Material",
          template: MenuMaterial
        },
        {
          text: "Camera",
          template: MenuPerspective
        },
      ]
    };
  },
  methods: {
    toggleMenu() {
      this.showMenu = !this.showMenu;
    },
    lockMenu() {
      this.isLockMenu = !this.isLockMenu;
    },
    closeMenu(){
      if (!this.isLockMenu) {
        this.showMenu = false;
        this.secActive = NaN;
      }
    },
    toggleSecMenu(index, e){
      this.secActive = this.secActive == index ? NaN : index;
      // console.log(e.currentTarget);
      // const _this = e.currentTarget;
      
      // console.log(_this.offsetTop);
      // let container = this.$el.querySelector(".panel");
      // container.scrollTop = 900;
      
    }
  }
};
</script>
<style lang="scss" scoped>
.menu {
  position: absolute;
  bottom: 5px;
  right: 5px;
  background: rgba(0, 0, 0, 0.6);
  width: 61px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  color: #fafafa;
  font-size: 40px;
}
.menu_button {
  background: transparent;
  padding: 0 60px;
  border: none;
  width: 100%;
  height: 60px;
  outline: none;
  color: #fafafa;
  font-size: 30px;
}
.lock_menu {
  display: none;
  position: absolute;
  top: 5px;
  right: 0;
  width: 60px;
  height: 50px;
  border-left: #7d8fa3 solid 1px;
  text-align: center;
  line-height: 2.2;
  font-size: 24px;
  cursor: pointer;
}
.menu_expanded {
  width: 100%;
  height: 40%;
  bottom: 0;
  right: 0;
  border-radius:0;
  // max-height: 80vh;
  .menu_button {
    border-bottom: #7d8fa3 1px solid;
  }
  .lock_menu {
    display: block;
  }
}

.panel {
  width: 100%;
  height: calc(100% - 60px);
  cursor: pointer;
  padding-top: 10px;
  padding-bottom: 20px;
  overflow-y: auto;
}
.space{
  height: 40px;
}
.action_list {
  height: 80px;
  line-height: 1.2;
  text-align: center;
  overflow: hidden;
  font-size: 24px;
  padding: 10px 0;
}
.toggle{
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.action_name {
  position: relative;
}

.action_expanded {
  height: auto;
  overflow: auto;
  .action_name{
    &::before {
      content: "[ ";
      position: absolute;
      top: 50%;
      left: -14px;
      transform: translateY(-50%);
    }

    &::after {
      content: " ]";
      position: absolute;
      top: 50%;
      right: -14px;
      transform: translateY(-50%);
    }
  }
}



// .show {
//   display: block !important;
// }
// .select {
//   background: dimgray;
// }
// .help_ctrl {
//   width: 40%;
//   height: 30px;
//   color: #fafafa;
// }
// .help_ctrl_contain {
//   display: none;
// }
</style>



