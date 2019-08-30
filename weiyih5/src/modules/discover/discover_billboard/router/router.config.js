import Activity from "../components/Content.vue"
import Recommend from "../components/Content.vue"
import Rule from "../components/Rule.vue"

export default {
    // mode:'history',
    routes: [
        {
            path:"/activity",
            component:Activity,
            name:2
        },
        {
            path:"/recommend",
            component:Recommend,
            name:3
        },
        {
            path:"/rule",
            component:Rule,
            name:4
        },
        {
            path:"/",
            redirect:"/activity"
        }
    ]
};