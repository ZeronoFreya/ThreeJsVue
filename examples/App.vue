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
        return {}
    },
    computed: {
        loading() {
            return this.$store.state.loading;
        }
    },
    beforeCreate() {},
    created() {},
    methods: {
        onLoad() {
            this.$store.commit('toggleLoading');
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
    /* background-image: linear-gradient(#7d8fa3, #1b1c1e); */
    background-color: #1b1c1e;
}
</style>
