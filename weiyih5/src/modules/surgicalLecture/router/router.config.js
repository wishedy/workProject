import SurgicalPractice from "../components/operate";
import Lecture from "../components/lecture";
import LectureProduce from "../components/lectureProduce";
import CourseProduce from "../components/courseProduce";

export default {
    routes: [
        {
            path: "/surgicalPractice",
            name: "surgicalPractice",
            component: SurgicalPractice
        },
        {
            path: "/surgicalLecture",
            name: "surgicalLecture",
            component: Lecture
        },
        {
            path: "/surgicalLectureProduce",
            name: "surgicalLectureProduce",
            component: LectureProduce
        },
        {
            path: "/courseProduce",
            name: "courseProduce",
            component: CourseProduce
        },
        {
            path: "/",
            redirect: "/surgicalPractice"
        }
    ]
};