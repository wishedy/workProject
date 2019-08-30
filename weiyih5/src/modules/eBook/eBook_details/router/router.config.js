import Article from "../components/Article.vue";
import Catalog from "../components/Catalog.vue";
import Comment from "../components/Comment.vue";
export default {
    routes: [
        {
            path:"/",
            redirect:"/catalog"
        },
        {
            path:"/article",
            name:"article",
            component:Article
        },
        {
            path:"/catalog",
            name:"catalog",
            component:Catalog
        },
        {
            path:"/comment",
            name:"comment",
            component:Comment
        }
    ]
};