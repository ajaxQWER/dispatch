import babelpolyfill from 'babel-polyfill'
import Vue from 'vue'
import ElementUI from 'element-ui'
import App from './App'
import VueRouter from 'vue-router'
import routes from './router'
import moment from 'moment'
import VueAMap from 'vue-amap'
import './assets/theme/theme-default/index.css'
import 'font-awesome/css/font-awesome.min.css'

Vue.use(ElementUI);
Vue.use(VueRouter);
Vue.use(VueAMap);
// Vue.use(Scrollactive);

// Vue.config.productionTip = false

// 初始化vue-amap
VueAMap.initAMapApiLoader({
    // 高德的key
    key: 'ff339b1e4c406691fb1af1fc4fa012e5', //正式aaef257a849413a2d9329e1b2a0fbb6e
    // 插件集合
    plugin: ['AMap.Autocomplete', 'AMap.Scale', 'AMap.OverView', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor','AMap.Geolocation']
});


const router = new VueRouter({
    mode: "history",
    routes: routes,
    scrollBehavior (to, from, savedPosition) {
      return { x: 0, y: 0 }
    }
})


Object.defineProperty(Vue.prototype, 'UPLOADURL', {value: process.env.UPLOAD_URL});
Object.defineProperty(Vue.prototype, 'BASEURL', {value: process.env.BASE_URL});

Object.defineProperty(Vue.prototype, 'moment', {value: moment});

router.beforeEach((to, from, next) => {
    let jwt = sessionStorage.getItem('jwt');
    if (!jwt && to.path != '/login') {
        next({ path: '/login' })
    } else {
        next();
        try{
            document.querySelector('#container').scrollTop = 0;
        }catch(e){}
    }
})

new Vue({
    router: router,
    render: h => h(App)
}).$mount('#app')
