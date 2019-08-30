import Entrance from "../components/entrance"
import Share from "../components/share"
import Invite from "../components/invite"
export default {
    routes: [
        {
            path: '/',
            component: Entrance
        },
        {
            path: '/share',
            component: Share
        },
        {
            path: '/invite',
            component: Invite
        }
    ]
}