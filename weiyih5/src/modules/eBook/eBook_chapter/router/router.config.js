import Article from "../components/ArticleBar.vue";
import Video from "../components/VideoBar.vue";
export default {
    routes: [
        {
            path:"/",
            redirect:"/article"
        },
        {
            path:"/article",
            name:"article",
            component:Article
        },
        {
            path:"/video",
            name:"video",
            component:Video
        },
    ]
};