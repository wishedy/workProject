/**
 * Create By zhangheng on 2018/10/18
 */
import comm from 'static/js/comm.js';
import index from '../components/index.vue';
import settled from '../components/settled.vue';
import open from '../components/open.vue';
import advisory from '../components/advisory.vue';
import income from '../components/income.vue';
import contactCustomerService from '../components/contactCustomerService.vue';
import practiceIntroduction from '../components/practiceIntroduction.vue';
import precautions from '../components/precautions.vue';
import specification from '../components/specification.vue';
import standard from '../components/standard.vue';
import aboutUs from '../components/aboutUs.vue';
import test from '../components/test.vue';
export default {
    routes:[
        {
            path:'/',
            name:'index',
            redirect:'/index'
        },
        {
            name:'advisory',
            path:'/advisory',
            component:advisory
        },
        {
            name:'test',
            path:'/test',
            component:test
        },
        {
            name:'standard',
            path:'/standard',
            component:standard
        },
        {
            name:'specification',
            path:'/specification',
            component:specification
        },
        {
            name:'precautions',
            path:'/precautions',
            component:precautions
        },
        {
            name:'practiceIntroduction',
            path:'/practiceIntroduction',
            component:practiceIntroduction
        },
        {
            name:'aboutUs',
            path:'/aboutUs',
            component:aboutUs
        },
        {
            name:'contactCustomerService',
            path:'/contactCustomerService',
            component:contactCustomerService
        },
        {
            name:'income',
            path:'/income',
            component:income
        },
        {
            name:'index',
            path:'/index',
            component:index
        },
        {
            name:'open',
            path:'/open',
            component:open
        },
        {
            name:'settled',
            path:'/settled',
            component:settled
        },
    ]
}
