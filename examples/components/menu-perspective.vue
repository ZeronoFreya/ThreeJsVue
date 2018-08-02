<template>
    <div class="expanded_panel">
        <li class="camera">Record</li>
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
    </div>
</template>

<script>
export default {
    data() {
        return {}
    }
}
</script>

<style scoped>
.expanded_panel {
  background: rgba(0, 0, 0, 0.6);
  padding: 10px 0;
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
</style>


