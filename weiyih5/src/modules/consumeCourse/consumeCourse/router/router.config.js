import home from '../components/HomeView';
import productContent from '../components/Introduction';
export default {
    routes: [
        {
            path: '*',
            redirect: '/home'
        },
        {
            path: '/home',
            component: home
        },
        {
            path: '/productContent',
            component: productContent
        }
    ]
}
