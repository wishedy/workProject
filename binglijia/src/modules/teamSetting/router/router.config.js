import createTeam from "../components/createTeam.vue"; //基本信息
import teamSetting from "../components/teamSetting.vue"; //基本信息


export default {
    routes: [
        {
            path: "/createTeam",
            component: createTeam
        },
        {
            path: "/teamSetting",
            component: teamSetting
        },
        {
            path: "*",
            redirect: "/createTeam"
        }
    ]
};
