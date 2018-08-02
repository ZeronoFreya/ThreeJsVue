<template>
    <div class="container">
        <view-layer 
            @on-load="onLoad"></view-layer>
        <float-menu></float-menu>
        <div class="loading" v-show="loading"></div>
    </div>
</template>
<script>
import ViewLayer from './components/view-layer';
import FloatMenu from './components/float-menu';
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
        FloatMenu
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
