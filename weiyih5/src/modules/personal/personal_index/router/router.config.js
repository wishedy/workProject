/**
 * Create By Lichunhui on 2018/01/08
 */
import Index from "../components/Index.vue";
import IndexHome from "../components/indexHome.vue";
import Info from "../components/Info.vue"
// // import Contribution from "../components/Contribution.vue";
// // import Active from "../components/Active.vue";
// import Info from "../components/Info.vue";
//
export default {
    routes:[
        {
            path:'/',
            redirect:'/index'
        },
        {
            path:"/index",
            component:Index
        },
        {
            path:"/IndexHome",
            component:IndexHome
        },
        {
            path:"/Info",
            component:Info
        }
    ]
}
