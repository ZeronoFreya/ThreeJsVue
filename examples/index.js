import Vue from 'vue'
import App from './App.vue'
// import router from './router'
import './utils/rem'
import './static/style/base.scss'

new Vue( {
    el: '#app',
    // router,
    render: h => h( App )
} )
