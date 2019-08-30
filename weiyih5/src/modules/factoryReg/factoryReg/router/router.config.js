import ad from "../views/ad";
import register from "../views/register";
import regFinish from "../views/regFinish";

export default {
    routes: [
        {
            path: "/",
            name: "ad",
            component: ad
        },
        {
            path: "/register",
            name: "register",
            component: register
        },
        {
            path: "/regFinish",
            name: "regFinish",
            component: regFinish
        }
    ]
}