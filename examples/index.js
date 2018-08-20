import Vue from 'vue'
import App from './App.vue'
import store from './store'
import fastclick from 'fastclick'
// import router from './router'
import './utils/rem'
import './static/style/base.scss'

new Vue( {
    el: '#app',
    // router,
    store,
    created: () => {
        fastclick.attach(document.body)
    },
    render: h => h( App )
} )
