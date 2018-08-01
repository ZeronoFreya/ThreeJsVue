<template>
    <div class="container">
        <view-layer 
            @on-load="onLoad"></view-layer>
        <menu-fuck></menu-fuck>
        <div class="loading" v-show="loading"></div>
    </div>
</template>
<script>
import ViewLayer from './components/view-layer';
import MenuFuck from './components/menu';
export default {
    data() {
        return {
            loading: true
        }
    },
    methods: {
        onLoad() {
            this.loading = false;
        }
    },
    components: {
        ViewLayer,
        MenuFuck
    }
}
</script>
<style>
@import "./static/style/base.scss";

.container{
    width: 100%;
    height: 100%;
    overflow: hidden;
}
</style>
