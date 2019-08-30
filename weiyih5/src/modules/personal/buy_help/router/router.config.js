import payHelp from '../components/PayHelpHome';
import payQuestionsDetails from '../components/PayQuestionDetails'
import AbnormalViewDetails from '../components/AbnormalViewDetails'
import OpenInvoiceDetails from '../components/OpenInvoiceDetails'
import PayWeChatDetails from '../components/PayWeChatDetails'
import PayZhiFuBaoDetails from '../components/PayZhiFuBaoDetails'
import RefundDetails from '../components/RefundDetails'
import AllinmdCurrency from '../components/allinmdCurrency.vue'
import Recharge from '../components/recharge.vue'
import PastDue from '../components/pastDue.vue'
import OnlyAllinmdCurrency from '../components/onlyAllinmdCurrency.vue'
import RemainingMoney from '../components/remainingMoney.vue'
import RemainingLose from '../components/remainingLose.vue'
import RightNow from '../components/rightNow.vue'
import CurrencyLast from '../components/currencyLast.vue'
import Unnecessary from '../components/unnecessary.vue';
import catRight from '../components/catRight.vue';
import listenBook from '../components/listenBook.vue';
import differentCourse from '../components/differentCourse.vue';

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
            path: "/differentCourse",
            component: differentCourse
        },
        {
            path: "/listenBook",
            component: listenBook
        },
        {
            path: "/catRight",
            component: catRight
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
            path: "/PastDue",
            component: PastDue
        },
        {
            path: "/Recharge",
            component: Recharge
        },
        {
            path: "/AllinmdCurrency",
            component: AllinmdCurrency
        },
        {
            path: "/Unnecessary",
            component: Unnecessary
        },
        {
            path: "/CurrencyLast",
            component: CurrencyLast
        },
        {
            path: "/RightNow",
            component: RightNow
        },
        {
            path: "/RemainingLose",
            component: RemainingLose
        },
        {
            path: "/RemainingMoney",
            component: RemainingMoney
        },
        {
            path: "/OnlyAllinmdCurrency",
            component: OnlyAllinmdCurrency
        },
        {
            path: "/PayZhiFuBaoDetails",
            component: PayZhiFuBaoDetails
        }

    ]
}
