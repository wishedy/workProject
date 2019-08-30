import Index from "../components/IndexBar";
import Praise from "../components/ContentBar";
import Remind from "../components/ContentBar";
import Follow from "../components/ContentBar";
import Review from "../components/ContentBar";

export default {
    routes: [
        {
            path: "/messageIndex",
            component: Index
        },
        {
            path: "/messageRemind",
            component: Remind
        },
        {
            path: "/messageFollow",
            component: Follow
        },
        {
            path: "/messagePraise",
            component: Praise
        },
        {
            path: "/messageReview",
            component: Review
        },
        {
            path: "/",
            redirect: "/messageIndex"
        }
    ]
};