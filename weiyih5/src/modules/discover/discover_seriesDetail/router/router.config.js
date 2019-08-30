import Produce from "../components/Produce.vue"
import Catalog from "../components/Catalog.vue"
import Related from "../components/Related.vue"

export default {
    routes: [
        {
            path:"/produce",
            component:Produce
        },
        {
            path:"/catalog",
            component:Catalog
        },
        {
            path:"/related",
            component:Related
        },
        {
            path:"*",
            redirect:"/catalog"
        }
    ]
};