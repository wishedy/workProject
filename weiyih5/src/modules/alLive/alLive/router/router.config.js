import LiveDocument from '../components/LiveDocument';
import LiveAgenda from '../components/LiveAgenda';
import LiveChat from '../components/LiveChat';
export default {
    routes: [
        {
            path: "/",
            redirect: "/agenda"
        },
        {//直播课件
            path:'/dc',
            name:'componentList',
            component:LiveDocument
        },
        {//直播课件
            path:'/agenda',
            name:'componentList',
            component:LiveAgenda
        },
        {//直播课件
            path:'/chat',
            name:'componentList',
            component:LiveChat
        },
    ]
}