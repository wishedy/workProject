import Index from "../components/searchIndex.vue"
import SearchResult from "../components/SearchResult.vue"
import AllResource from "../components/AllResource.vue"
import Case from "../components/Case.vue"
import Video from "../components/Video.vue"
import Meeting from "../components/Meeting.vue"
import Doctor from "../components/Doctor.vue"
import Doc from "../components/Doc.vue"
import Topic from "../components/Topic.vue"
import Product from "../components/Product.vue"
import comm from "static/js/comm.js";

let para = comm.getpara();

export default {
    routes: [
        {
            path: "/searchIndex",
            component: Index
        },
        {
            path: "/searchResult",
            component: SearchResult,
            children:[
                {
                    path: "/all",
                    component: AllResource,
                    params: {keyword:para.keyword}
                },
                {
                    path: "/video",
                    component: Video,
                    params: {keyword:para.keyword}
                },
                {
                    path: "/product",
                    component: Product,
                    params: {keyword:para.keyword}
                },
                {
                    path: "/case",
                    component: Case,
                    params: {keyword:para.keyword}
                },
                {
                    path: "/searchResult",
                    redirect: "/all",
                    params: {keyword:para.keyword}
                },
                {
                    path: "/meeting",
                    component: Meeting,
                    params: {keyword:para.keyword}
                },
                {
                    path: "/doctor",
                    component: Doctor,
                    params: {keyword:para.keyword}
                },
                {
                    path: "/doc",
                    component: Doc,
                    params: {keyword:para.keyword}
                },
                {
                    path: "/topic",
                    component: Topic,
                    params: {keyword:para.keyword}
                }
            ]
        },
        {
            path: "*",
            redirect: "/searchIndex"
        }
    ]
};