
import orgNews from "../components/orgNewsBulletin";
import orgInfo from "../components/orgInfo.vue";
import orgFollow from '../components/orgFollow.vue';
import orgMembers from '../components/orgMembers.vue'

export default {
    routes: [
        {
            path: "/",
            component: orgInfo
        },
        {
            path: "/orgNewsBulletin",
            component: orgNews
        },
        {
            path:'/orgFollow',
            component:orgFollow
        },
        {
            path:'/orgMembers',
            component:orgMembers
        }
    ]
};