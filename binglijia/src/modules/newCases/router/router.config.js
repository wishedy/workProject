import baseInfo from "../components/baseInfo.vue";//基本信息
import comLibrary from "../components/comLibrary.vue";//基本信息
import assemble from "../components/assemble.vue";//组装页面
import tplate from "../components/tplate.vue";//组装页面

export default {
    routes: [
        {
            name: 'baseInfo',
            path: "/baseInfo",
            component: baseInfo
        },
        {
            path: "/comLibrary",
            component: comLibrary
        },
        {
            path: '/assemble/:menuId',
            name: 'assemble',
            component: assemble
        },
        {
            name: 'tplate',
            path: "/tplate",
            component: tplate
        },
        {
            path: "*",
            redirect: "/baseInfo"
        }
    ]
};
