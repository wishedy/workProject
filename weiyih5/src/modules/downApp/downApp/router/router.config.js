import downAppHome  from '../components/Home';
import weixinReminder  from '../components/weixinReminder';
export default {
    routes: [
        {
            path: '*',
            redirect: '/downAppHome'
        },
        {
            path: '/downAppHome',
            component: downAppHome
        },
        {
            path: '/weixinReminder',
            component: weixinReminder
        },
    ]
}
