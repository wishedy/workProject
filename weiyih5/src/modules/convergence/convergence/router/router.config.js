import convergence from '../components/Home.vue'
import allBrands from '../components/AllBrands'
import allAreas from '../components/AllAreas'
import allActivies from '../components/AllActivies'
export default {
    routes: [
        {
            path: '*',
            redirect: '/convergence'
        },
        {
            path: '/convergence',
            component: convergence
        },
        {
            path: '/allBrands', // 全部品牌
            component: allBrands
        },
        {
            path: '/allAreas', // 全部专题
            component: allAreas
        },
        {
            path: '/allActivies', // 全部活动
            component: allActivies
        }
    ]
}
