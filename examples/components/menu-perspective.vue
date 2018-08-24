<template>
    <div class="expanded_panel">
        <li class="camera">Record</li>
        <table class="table">
            <tr class="tr">
                <td class="td">
                    <button id="top" class="btn" type="button"
                        @click.prevent.stop="toTop">T</button>
                </td>
                <td class="td">
                    <button class="btn" type="button">&#9650;</button>
                </td>
                <td class="td">
                    <button id="show_back" class="btn" type="button"
                        @click.prevent.stop="toBack">&#9851;</button>
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
                    <button id="front" class="btn" type="button"
                        @click.prevent.stop="toFront">F</button>
                </td>
                <td class="td">
                    <button class="btn" type="button">&#9660;</button>
                </td>
                <td class="td">
                    <button id="right" class="btn" type="button"
                        @click.prevent.stop="toRight">R</button>
                </td>
            </tr>
        </table>
    </div>
</template>

<script>
// import EventHub from "../../src/eventHub";
import { mapMutations } from 'vuex';
export default {
    data() {
        return {
            target:{ x: 0, y: 59, z: 0 }
        }
    },
    methods:{
        toFront(){
            // EventHub.$emit('tofront',null);
            this.setFacedPlane('front');
            this.$emit('closeMenu');
        },
        toRight(){
            this.setFacedPlane('right');
            this.$emit('closeMenu');
        },
        toTop(){
            this.setFacedPlane('top');
            this.$emit('closeMenu');
        },
        toBack(){
            this.setFacedPlane('back');
            this.$emit('closeMenu');
        },
        ...mapMutations([
            'setFacedPlane'
        ])
    }
}
</script>

<style scoped>
.expanded_panel {
  background: rgba(0, 0, 0, 0.6);
  padding: 10px 0;
  padding-bottom: 40px;
}
.camera{
  height: 60px;
  line-height: 60px;
}
.table {
  display: table;
  margin: 0 auto;
  border-collapse: collapse;
}
.tr {
  display: table-row;
}
.td {
  display: table-cell;
}
.btn {
  width: 80px;
  height: 60px;
  background: #323232;
  border: none;
  outline: none;
  border-radius: 6px;
  margin: 4px;
  cursor: pointer;
  color: #fafafa;
  font-size: 30px;
}
</style>


