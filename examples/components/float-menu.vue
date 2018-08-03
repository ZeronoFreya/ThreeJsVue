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
                  @click.prevent.stop="toggleSecMenu(index)">
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
        this.showMenu = false
      }
    },
    fullScreen() {
      console.log("Full Screen");
    },
    switchMtl(mtl) {
      console.log(mtl);
    },
    toggleSecMenu(index){
      console.log(index);
      
        this.secActive = index;
    }
  },
  components: {
    MenuMaterial, MenuPerspective
  },
  computed: {
    currentTabComponent: function () {
      return 'tab-' + this.currentTab.toLowerCase()
    }
  }
};
</script>
<style scoped>
.menu {
  position: absolute;
  bottom: 5px;
  right: 5px;
  background: rgba(0, 0, 0, 0.6);
  width: 60px;
  height: 40px;
  border-radius: 6px;
  overflow: hidden;
  color: #fafafa;
}
.menu_expanded {
  width: 150px;
  height: auto;
  max-height: 80vh;
}
.menu_button {
  background: transparent;
  /* background: gold; */
  border: none;
  width: 100%;
  height: 40px;
  outline: none;
  color: #fafafa;
}
.menu_expanded .menu_button {
  border-bottom: #7d8fa3 1px solid;
}
.lock_menu {
  display: none;
  position: absolute;
  top: 5px;
  right: 0;
  width: 30px;
  height: 30px;
  border-left: #7d8fa3 solid 1px;
  text-align: center;
  line-height: 2.2;
  font-size: 14px;
  cursor: pointer;
}
.menu_expanded .lock_menu {
  display: block;
}
.panel {
  width: 100%;
  /* background: blueviolet; */
  height: auto;

  cursor: pointer;
  padding-top: 10px;
  padding-bottom: 20px;
}

.action_list {
  height: 30px;
  line-height: 30px;
  text-align: center;
  overflow: hidden;
}
.action_expanded {
  height: auto;
  overflow: auto;
}

.action_name {
  position: relative;
}
.action_expanded .action_name::before {
  content: "[ ";
  position: absolute;
  top: 50%;
  left: -14px;
  transform: translateY(-50%);
}
.action_expanded .action_name::after {
  content: " ]";
  position: absolute;
  top: 50%;
  right: -14px;
  transform: translateY(-50%);
}

.show {
  display: block !important;
}
.select {
  background: dimgray;
}
.help_ctrl {
  width: 40%;
  height: 30px;
  color: #fafafa;
}
.help_ctrl_contain {
  display: none;
}
</style>



