import comm from "../../../../../static/js/comm";

const mutaions = {
    //loading状态改变
    changeLoading(state,data){
        state.isLoading = data
    },
    //组织简介弹层
    changeNewsPop(state,data){
        state.newsPop = data
    },
    //滚动事件定位条展示
    changeHeadShow(state,data){
        state.headShow = data
    },
    //事件埋点
    commCreateEvent(state,option){
        let dataJson={
            "11471":{keyword:"查看简介"},
            "11472":{keyword:"查看成员"},
            "11473":{keyword:"查看粉丝"},
            "11474":{keyword:"查看资源"},
            "11475":{keyword:"组织专栏筛选"},
            "11476":{keyword:"组织内容点击"},
            "11477":{keyword:"关注组织"},
            "11478":{keyword:"点击首条新闻"},
            "11479":{keyword:"点击第二条新闻"},
            "11480":{keyword:"查看更多新闻"},
            "11481":{keyword:"分享组织"},
        };
        comm.creatEvent({
            locationId:option.locationId||'',
            triggerType:"组织主页",
            triggerName:option.keyword?option.keyword:dataJson[option.id].keyword,
            browType:375,
            actionId:option.id
        });
    }
};
export default mutaions;