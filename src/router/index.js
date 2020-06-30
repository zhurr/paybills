import Vue from 'vue'
import VueRouter from 'vue-router'
import OverviewHome from '@/views/overview/home.vue'

Vue.use(VueRouter)

const routes = [{
    path: '/',
    // component: () => import('@/views/month/home.vue'),
    // component: OverviewHome
    redirect: '/MonthHome'
},

// 省级
{
    path: '/ProvinceHome',
    name: 'ProvinceHome',
    component: () => import('@/views/province/home.vue'),
    meta: {
        title: '租户运营(省级)'
    },

},

// 一级资源池
{
    path: '/PoolHome',
    name: 'PoolHome',
    component: () => import('@/views/pool/home.vue'),
    meta: {
        title: '资源池运营'
    },
    // children: [
    //     {
    //         path: 'page1',
    //         component: () => import('@/views/pool/page1.vue'),
    //         meta: {
    //             title: '资源池运营'
    //         }
    //     }],
    // redirect: '/PoolHome/page1',

},
// 总览
{
    path: '/OverviewHome',
    name: 'OverviewHome',
    component: OverviewHome,
    meta: {
        title: '租户运营(总览)'
    }
},
// 月报
{
    path: '/MonthHome',
    name: 'MonthHome',
    component: () => import('@/views/month/home.vue'),
    meta: {
        title: '租户运营月报'
    }
},
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (about.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import( /* webpackChunkName: "about" */ '../views/About.vue')
    // }
]

const router = new VueRouter({
    mode: 'history',
    routes
})

router.beforeEach((to, from, next) => {
    //标题
    if (to.meta.title) {
        document.title = to.meta.title
    }
    next()
})

export default router