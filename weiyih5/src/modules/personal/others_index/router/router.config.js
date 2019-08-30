/**
 * Create By DingLindong on 2017/12/5
 */
import indexHome from "../components/indexHome.vue";
import Info from "../components/Info.vue";
import comm from 'static/js/comm.js';
export default {
    routes:[
        {
            path:'/',
            redirect:'/IndexHome',
            params:{
                cid:comm.getpara().cid
            }
        },
        {
            path:'/IndexHome',
            component:indexHome,
			params:{
				cid:comm.getpara().cid
			}
        },
        {
            path:'/contribution',
            component:indexHome,
            params:{
                cid:comm.getpara().cid
            }
        },
        {
            path:'/Info',
            component:Info,
			params:{
				cid:comm.getpara().cid
			}
        }
    ]
}
