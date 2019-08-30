import payHelp from '../components/PayHelpHome';
import payQuestionsDetails from '../components/PayQuestionDetails'
import AbnormalViewDetails from '../components/AbnormalViewDetails'
import OpenInvoiceDetails from '../components/OpenInvoiceDetails'
import PayWeChatDetails from '../components/PayWeChatDetails'
import PayZhiFuBaoDetails from '../components/PayZhiFuBaoDetails'
import RefundDetails from '../components/RefundDetails'

export default {
    routes: [
        {
            path: "*",
            redirect: "/payHelp"
        },
        {
            path: "/payHelp",
            component: payHelp
        },
        {
            path: "/payQuestionsDetails",
            component: payQuestionsDetails
        },
        {
            path: "/PayWeChatDetails",
            component: PayWeChatDetails
        },
        {
            path: "/AbnormalViewDetails",
            component: AbnormalViewDetails
        },
        {
            path: "/OpenInvoiceDetails",
            component: OpenInvoiceDetails
        },
        {
            path: "/RefundDetails",
            component: RefundDetails
        },
        {
            path: "/PayZhiFuBaoDetails",
            component: PayZhiFuBaoDetails
        }

    ]
}
