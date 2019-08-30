import payCourse from '../components/PayCourse'
import moreReply from '../components/MoreReply'
export default {
    routes: [
        {
            path: "*",
            redirect: "/payCourse"
        },
        {
            path: '/payCourse',
            component:payCourse,
        },
        {
            path: '/moreReply',
            component:moreReply
        }
    ]
}