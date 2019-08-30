import comm from "static/js/comm";
import app from "static/js/comm.app";

let path = {
    eventUrl:'/mcall/customer/event/getMapList/',//大事件
};
const mutaions = {
    callApp(state,text){
        let amChannel = comm.getpara()._amChannel;
        let cId=comm.getpara().cid;
        app.newReleaseBox({
            imgPath:"//img50.allinmd.cn/case/release.png",
            title:text+"需使用唯医骨科App",
            solidBtnTitile:"立即使用",
            authNoneTitle:" ",
            data:{
                el: ".solidBtn",
                ios: "allinmdios://app.allinmd.cn/applinks.html?scene=terminalPage&index=0"+(cId?"&sourceId=" + cId:"") +"&tplPath=5"+ (amChannel?"&_amChannel="+amChannel:''),
                android: "allin://com.allin.social:75235?data={scene:10,type:14"+(cId?",userId:"+  cId :'')+",tplPath:0"+ (amChannel?",_amChannel:"+amChannel:'')+ "}",
                ios9: "http://app.allinmd.cn/applinks.html?scene=terminalPage&index=0"+(cId?"&sourceId=" + cId:"") +"&tplPath=5"+ (amChannel?"&_amChannel="+amChannel:''),
            }
        });
    },
    getEvent(state,data){
        mutaions.changeIsAjax(state,true);
        comm.ajax2({
            url:path.eventUrl,
            type:'post',
            // data:{paramJson:JSON.stringify({customerId:t.customerId})},
            data:data,
            success:(req)=>{
                mutaions.changeIsAjax(state,false);
                if(req&&req.responseObject&&req.responseObject.responseData&&req.responseObject.responseData.dataList){
                    state.eventList= req.responseObject.responseData.dataList;
                }
            }
        })
    },
    changeIsAjax(state,data){
        if(data){
            state.isAjax.push(data);
        }else {
            state.isAjax.pop();
        }
    },
    changeIscontentTab(state,data){
        state.iscontentTab=data;
    },
    changeIsHeader(state,data){
        state.isHeader=data;
    },
    //事件埋点
    commCreatEvent(state,option){
        // let dataJson={
        //     "11267":{keyword:"他关注的人点击"},
        //     "11268":{keyword:"他的粉丝点击"},
        //     "11269":{keyword:"他的资源点击"},
        //     "11270":{keyword:"关注点击"},
        //     "11275":{keyword:"专栏tab点击"},
        //     "11276":{keyword:"云云tab点击"},
        //     "11277":{keyword:"专栏筛选点击"},
        //     "11278":{keyword:"专栏筛选-全部点击"},
        //     "11279":{keyword:"专栏筛选-视频点击"},
        //     "11280":{keyword:"专栏筛选-病例点击"},
        //     "11281":{keyword:"专栏筛选-文库点击"},
        //     "11282":{keyword:"个人资料详情点击"},
        //     "11283":{keyword:"专栏内容点击"},
        //     "11284":{keyword:"云云内容点击"},
        //
        // };
        let dataJson={
            "11244":{keyword:"我关注的人点击"},
            "11245":{keyword:"我的粉丝点击"},
            "11246":{keyword:"我的资源点击"},
            "11270":{keyword:"关注点击"},
            "11255":{keyword:"专栏tab点击"},
            "11256":{keyword:"云云tab点击"},
            "11257":{keyword:"专栏筛选点击"},
            "11258":{keyword:"专栏筛选-全部点击"},
            "11259":{keyword:"专栏筛选-视频点击"},
            "11260":{keyword:"专栏筛选-病例点击"},
            "11261":{keyword:"专栏筛选-文库点击"},
            "11262":{keyword:"个人资料详情点击"},
            "11263":{keyword:"专栏内容点击"},
            "11264":{keyword:"云云内容点击"},

        };
        comm.creatEvent({
            locationId:option.locationId||'',
            triggerType:"他人主页",
            triggerName:dataJson[option.id].keyword,
            browType:299,
            actionId:option.id
        });
    }
};
export default mutaions;