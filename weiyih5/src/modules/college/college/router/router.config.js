import CollegeHome from '../components/CollegeHome'
import CollegeProduce from '../components/CollegeProduce'
import CollegeDetail from '../components/CollegeDetail'
import CollegeDetailInfo from '../components/CollegeDetailInfo'

export default {
    routes: [
        {
            path: "*",
            redirect: "/collegeHome"
        },
        {
            path: "/collegeHome",
            component: CollegeHome
        },
        {
            path: "/collegeDetail",
            component: CollegeDetail
        },
        {
            path: "/collegeProduce",
            component: CollegeProduce
        },
        {
            path: "/collegeDetailInfo",
            component: CollegeDetailInfo
        }
    ]
}