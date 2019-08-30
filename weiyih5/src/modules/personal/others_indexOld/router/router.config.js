/**
 * Create By DingLindong on 2017/12/5
 */
import Dynamic from "../components/Dynamic.vue";
import Contribution from "../components/Contribution.vue";
import BaseInfo from "../components/BaseInfo.vue";
import comm from 'static/js/comm.js';
export default {
    routes:[
        {
            path:'/',
            redirect:'/contribution',
            params:{
                cid:comm.getpara().cid
            }
        },
        {
            path:'/dynamic',
            component:Dynamic,
			params:{
				cid:comm.getpara().cid
			}
        },
        {
            path:'/contribution',
            component:Contribution,
			params:{
				cid:comm.getpara().cid
			}
        },
        {
            path:'/baseInfo',
            component:BaseInfo,
			params:{
				cid:comm.getpara().cid
			}
        }
    ]
}
