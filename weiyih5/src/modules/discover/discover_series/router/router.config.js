import Content from "../components/Content.vue"
export default {
    routes: [
        {
            path:"/type0",
            component:Content
        },
        {
            path:"/type9",
            component:Content
        },
        {
            path:"/type7",
            component:Content
        },
        {
            path:"/type2",
            component:Content
        },
        {
            path:"*",
            redirect:"/type0"
        }
    ]
};