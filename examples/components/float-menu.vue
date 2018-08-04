<template>
  <div class="menu" :class="{'menu_expanded': showMenu}">
		<button type="button" class="menu_button" @click.prevent.stop="toggleMenu">Menu</button>
		<i class="lock_menu" @click.prevent.stop="lockMenu">{{isLockMenu ? 'T':'N'}}</i>
		<ul class="panel">
      <template v-for="(item, index) in items">
          <li class="action_list"
              :class="{'action_expanded': index == secActive}" 
              v-if="item.template">
              <div class="toggle"
                  @click.prevent.stop="toggleSecMenu(index, $event)">
                  <span class="action_name">{{ item.text }}</span>
              </div>
              <component @closeMenu="closeMenu" :is="item.template"></component>
          </li>
          <li class="action_list" v-else @click.prevent.stop="item.action">{{ item.text }}</li>
      </template>
		</ul>
	</div>
</template>
<script>
import MenuMaterial from "./menu-material";
import MenuPerspective from "./menu-perspective";
// import {scroller} from 'vue-scrollto/src/scrollTo'
export default {
  data() {
    return {
      showMenu: false,
      isLockMenu: false,
      secActive:NaN,
      items: [
        {
          text: "Full Screen",
          action: this.fullScreen
        },
        {
          text: "Auto Rotate",
          action: this.fullScreen
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
    fullScreen() {
      console.log("Full Screen");
    },
    switchMtl(mtl) {
      console.log(mtl);
    },
    toggleSecMenu(index, e){
      this.secActive = this.secActive == index ? NaN : index;
      // console.log(e.currentTarget);
      // const _this = e.currentTarget;
      
      // console.log(_this.offsetTop);
      // let container = this.$el.querySelector(".panel");
      // container.scrollTop = 900;
      
    }
  },
  components: {
    MenuMaterial, MenuPerspective
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

.action_list {
  height: 60px;
  line-height: 60px;
  text-align: center;
  overflow: hidden;
  font-size: 24px;
  padding: 10px 0;
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



