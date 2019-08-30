import Home from '../components/Home'
import EliteConferencePage from '../components/EliteConferencePage';
import EliteAcademic from '../components/EliteAcademic';
import EliteOrganization from '../components/EliteOrganization';
import EliteFaceToFace from '../components/EliteFaceToFace';
import EliteMember from '../components/EliteMember';
import EliteGroup from '../components/EliteGroup';
export default {
    routes: [
        {
            path: "/",
            redirect: "/home"
        },
        {
            path: "/home",
            name: "home",
            component: Home
        },
        {
            path: "/conference",
            name: "conference",
            component: EliteConferencePage
        },
        {
            path: "/member",
            name: "member",
            component: EliteMember
        },
        {
            path: "/organization",
            name: "organization",
            component: EliteOrganization
        },
        {
            path: "/academic",
            name: "academic",
            component: EliteAcademic
        },
        {
            path: "/face",
            name: "face",
            component: EliteFaceToFace
        },
        {
            path: "/group",
            name: "group",
            component: EliteGroup
        }
    ]
}