import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import './plugins/element.js'
import 'lib-flexible'
import vuescroll from 'vuescroll/dist/vuescroll-native';

Vue.use(vuescroll, {
    // 在这里设置全局默认配置
    ops: {
        vuescroll: {},
        scrollPanel: {

        },
        rail: {
            background: '#01a99a',
            opacity: 0,
            size: '6px',
            specifyBorderRadius: false,
            gutterOfEnds: null,    //轨道距 x 和 y 轴两端的距离
            gutterOfSide: '0',   //距离容器的距离
            keepShow: false,   //是否即使 bar 不存在的情况下也保持显示
            border: 'none'    //边框
        },
        bar: {
            keepShow: true,
            size: '6px',
            // hoverStyle: true,
            onlyShowBarOnScroll: false, //是否只有滚动的时候才显示滚动条
            background: '#3C397B',   //颜色
        }
    },

    name: 'vueScroll' // 在这里自定义组件名字，默认是vueScroll
});

Vue.config.productionTip = false

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')