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
import EventHub from '../src/eventHub';

export default {
    data() {
        return {
            loading: true
        }
    },
    created() {
        EventHub.$on('loading', () => {
            this.loading = !this.loading;
        });
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

.container{
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-image: linear-gradient(#7d8fa3, #1b1c1e);
}
</style>
