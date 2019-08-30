import brands from '../components/Home.vue'
import latestNews from '../components/LatestNews.vue'
import underProduct from '../components/UnderProduct.vue'
import academic from '../components/Academic.vue'
export default {
    routes: [
        {
            path: '*',
            redirect: '/brands'
        },
        {
            path: '/brands',
            component: brands
        },
        {
            path: '/latestNews', // 最新动态
            component: latestNews
        },
        {
            path: '/underProduct', // 旗下产品
            component: underProduct
        },
        {
            path: '/academic', // 学术内容
            component: academic
        }
    ]
}