import buyHelp from '../components/BuyHome'
export default {
    routes: [
        {
            path: "*",
            redirect: "/buyHelp"
        },
        {
            path: "/buyHelp",
            component: buyHelp
        }
      ]
}