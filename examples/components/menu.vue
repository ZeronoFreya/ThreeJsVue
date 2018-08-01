<template>
    <div class="menu" :class="{'menu_expanded': showMenu}">
		<button type="button" class="menu_button" @click.prevent.stop="toggleMenu">Menu</button>
		<i class="lock_menu" @click.prevent.stop="lockMenu">{{isLockMenu ? 'T':'N'}}</i>
		<ul class="panel">
			<li id="full_screen" class="action_list">Full Screen</li>
			<li id="auto_rotate" class="action_list">Auto Rotate</li>
			<li class="action_list">
				<div class="toggle">
					<span class="toggle">Material</span>
				</div>
				<ul>
                    <li v-for="item in items">{{ item.message }}</li>
					<li class="material" data-tp='standard'>standard</li>
					<li class="material" data-tp='wire'>wire</li>
					<li class="material" data-tp='flat'>flat</li>
					<li class="material" data-tp='gouraud'>gouraud</li>
					<li class="material" data-tp='phong'>phong</li>
					<li class="material" data-tp='basicRim'>basicRim</li>
					<li class="material" data-tp='advToon' default>advToon</li>
				</ul>
			</li>
			<li class="action_list">
				<div class="toggle">
					<span>Camera</span>
				</div>
				<ul>
					<li id="record" class="camera" data-tp='record'>Record</li>
					<table class="table">
						<tr class="tr">
							<td class="td">
								<button id="top" class="btn" type="button">T</button>
							</td>
							<td class="td">
								<button class="btn" type="button">&#9650;</button>
							</td>
							<td class="td">
								<button id="show_back" class="btn" type="button">&#9851;</button>
							</td>
						</tr>
						<tr class="tr">
							<td class="td">
								<button id="left" class="btn" type="button">&#9668;</button>
							</td>
							<td class="td">
								<button id="test" class="btn" type="button">&#9769;</button>
							</td>
							<td class="td">
								<button class="btn" type="button">&#9658;</button>
							</td>
						</tr>
						<tr class="tr">
							<td class="td">
								<button id="front" class="btn" type="button">F</button>
							</td>
							<td class="td">
								<button class="btn" type="button">&#9660;</button>
							</td>
							<td class="td">
								<button id="right" class="btn" type="button">R</button>
							</td>
						</tr>
					</table>
				</ul>
			</li>
			<li class="action_list">
				<div class="toggle">
					<span class="toggle">Help</span>
				</div>
				<ul>
					<li class="help_ctrl_contain">
						<button type="button" id="toggle_help" class="help_ctrl">Hide</button>
						<button type="button" id="edit_help" class="help_ctrl">Edit</button>
					</li>
					<li class="help" data-tp='doll'>Doll</li>
					<li class="help" data-tp='ratio'>Golden ratio</li>
				</ul>
			</li>
		</ul>
	</div>
</template>
<script>
export default {
    name: 'menu',
    data(){
        return {
            showMenu : false,
            isLockMenu: false,
            items: [
                { message: 'Foo' },
                { message: 'Bar' }
            ]
        }
    },
    methods:{
        toggleMenu(){
            this.showMenu = !this.showMenu;
            // let _p = this.parentNode;
            // let rs = _p.classList.contains("menu_expanded");

            // if (rs) {
            //     lockMenu = false;
            //     document.getElementById('lock_menu').innerText = 'N';
            //     menu_collapse();
            // } else {
            //     _p.classList.add("menu_expanded");
            // };
        },
        lockMenu(){
            this.isLockMenu = !this.isLockMenu;
        }
    }
}
</script>
<style scoped>
    .menu{
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
.menu_expanded{
    width: 150px;
    height: auto;
    max-height: 80vh;
}
.menu_button{
    background: transparent;
    /* background: gold; */
    border: none;
    width: 100%;
    height: 40px;
    outline: none;
    color: #fafafa;
}
.menu_expanded .menu_button{
    border-bottom: #7d8fa3 1px solid;
}
.lock_menu{
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
.menu_expanded .lock_menu{
    display: block;
}
.panel{
    width: 100%;
    /* background: blueviolet; */
    height: auto;
    
    cursor: pointer;
    padding-top: 10px;
    padding-bottom: 20px;
}

.action_list{
    height: 30px;
    line-height: 30px;
    text-align: center;
    overflow: hidden;
}
.action_expanded{
    height: auto;
    overflow: auto;
}
.action_list ul{
    background: rgba(0,0,0,0.6);
    padding: 10px 0;
}
.action_expanded span{
    position: relative;
}
.action_expanded span::before{
    content: '[ ';
    position: absolute;
    top: 50%;
    left: -14px;
    transform: translateY(-50%);
}
.action_expanded span::after{
    content: ' ]';
    position: absolute;
    top: 50%;
    right: -14px;
    transform: translateY(-50%);
}

.table{
    display: table;
    margin: 0 auto;
    border-collapse: collapse;
}
.tr{
    display: table-row;
}
.td{
    display: table-cell;
}
.btn{
    width: 30px;
    height: 30px;
    background: #323232;
    border: none;
    outline: none;
    border-radius: 6px;
    margin: 2px;
    cursor: pointer;
    color: #fafafa;
}
.show {
    display: block !important;
}
.select{
    background: dimgray;
}
.help_ctrl{
    width: 40%;
    height: 30px;
    color: #fafafa;
}
.help_ctrl_contain{
    display: none;
}
</style>



