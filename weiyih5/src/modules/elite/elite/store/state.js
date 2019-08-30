import TempCache from "../../../../../static/js/tempcache";
let userId = TempCache.getItem('userId');
const state = {
    liveIndexList:[],
    liveTotalCount:0,
    scrollTop:0,
    userId:userId,
    organizationName:'',
    columnState:0,
    bannerData:{}
};

export default  state;