import Comment from "../components/Comment.vue"
export default {
    routes: [
        {
            path:"/release",
            component:Comment
        },
        {
            path:"/comment",
            component:Comment
        },
        {
            path:"/browse",
            component:Comment
        },
        {
            path:"*",
            redirect:"/release"
        }
    ]
};