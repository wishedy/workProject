import relatedProducts from '../components/relatedProducts';
import componentList from '../components/componentList';
import productDetail from '../components/productDetail';
import terminalRelatedProducts from '../components/terminalRelatedProducts';
import brandDetail from '../components/brandDetail';
import relateContent from '../components/relateContent';
import brandList from '../components/brandList';
import contactList from '../components/contactList';
export default {
    routes: [
        {
            path: "/",
            redirect: "/relatedProducts"
        },
        {//所有组件所在的页面
            path:'/componentList',
            name:'componentList',
            component:componentList
        },
        {//终端页进入的相关产品
            path:'/relatedProducts',
            name:'relatedProducts',
            component:relatedProducts
        },
        {//产品详情页
            path:'/productDetail',
            name:'productDetail',
            component:productDetail
        },
        {//厂商联系电话
            path:'/contactList',
            name:'contactList',
            component:contactList
        },
        {//品牌详情页
            path:'/brandDetail',
            name:'brandDetail',
            component:brandDetail
        },
        {//相关内容列表页
            path:'/relateContent',
            name:'relateContent',
            component:relateContent
        },
        {//旗下品牌列表页
            path:'/brandList',
            name:'brandList',
            component:brandList
        },
        {//旗下品牌列表页
            path:'/terminalRelatedProducts',
            name:'terminalRelatedProducts',
            component:terminalRelatedProducts
        },
    ]
}