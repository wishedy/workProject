import Home from "../components/home";
import Charter from "../components/charter";
import Election from "../components/election";
import Management from "../components/management";
import Architecture from "../components/architecture";
import Introduction from "../components/introduction";

export default {
    routes: [
        {
            path: "/home",
            name: "home",
            component: Home
        },
        {
            path: "/introduction",
            name: "introduction",
            component: Introduction
        },
        {
            path: "/architecture",
            name:'architecture',
            component: Architecture
        },
        {
            path: "/management",
            name:'management',
            component: Management
        },
        {
            path: "/election",
            name:'election',
            component: Election
        },
        {
            path: "/charter",
            name:'charter',
            component: Charter
        },
        {
            path: "/",
            redirect: "/home"
        }
    ]
};